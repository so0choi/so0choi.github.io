---
title: "[React] setInterval 내부에서 state 업데이트 하기"
description: 'setInterval 콜백 안에서 state를 업데이트하면 값이 한 번만 바뀌고 더 이상 변하지 않는다. 콜백이 처음 렌더링 시점의 state를 클로저로 붙잡고 있기 때문이다. 함수형 업데이트나 useRef로 해결할 수 있다.'
pubDate: 2023-04-10 09:25:26
category: frontend
tags:
  - React
  - setInterval
---

1초마다 숫자를 올리는 카운터를 만들려고 아래처럼 작성했다.

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>{count}</div>;
}
```

그런데 화면에는 `1`이 찍힌 뒤 더 이상 숫자가 올라가지 않는다.

## 원인 - stale closure

`useEffect`의 의존성 배열이 `[]`라서 effect는 첫 렌더링 때 한 번만 실행되고, 이때 만들어진 `setInterval` 콜백은 **첫 렌더링 시점의 `count`(= 0)** 를 클로저로 기억한다.

의존성 배열이 `[]`여도 리렌더링 자체는 일어난다. `setCount`로 값이 바뀌면 컴포넌트 함수가 다시 실행되면서 새로운 `count`가 만들어진다. `[]`가 막는 건 리렌더링이 아니라 **effect의 재실행**이다. 그래서 interval 콜백은 새 `count`를 모른 채 매 초 `setCount(0 + 1)`만 반복한다.

```
렌더링 1: count = 0  → effect 실행, interval 콜백이 이 count(0)를 붙잡음
1초 후:   setCount(0 + 1) → 값이 바뀌어 리렌더링
렌더링 2: count = 1  → 의존성 배열이 []라 effect 재실행 안 됨. 콜백은 여전히 count = 0
1초 후:   setCount(0 + 1) → 1 (값이 같아서 화면 변화 없음)
1초 후:   setCount(0 + 1) → 1 ...
```

이 동작을 이해하려면 클로저와, React에서 "렌더링"이 실제로 무엇인지를 알아야 한다.

### 클로저란

클로저는 함수가 **자신이 만들어진 시점의 스코프를 기억하는 것**이다. 함수 안에서 바깥 변수를 참조하면, 함수는 그 변수를 값으로 복사하는 게 아니라 그 변수가 있는 스코프 자체를 붙잡고 있다.

```js
function makeLogger() {
  const message = "hello";
  return () => console.log(message);
}

const logger = makeLogger();
logger(); // hello
```

`makeLogger`는 이미 실행이 끝났지만 `logger`는 `makeLogger` 실행 당시의 스코프를 기억하고 있어서 `message`를 읽을 수 있다.

### 렌더링 = 컴포넌트 함수 호출

React에서 렌더링은 결국 **컴포넌트 함수를 다시 호출하는 것**이다. 함수를 호출할 때마다 새로운 스코프가 생기고, 그 안의 `const [count, setCount] = useState(0)`도 새로 실행된다.

여기서 헷갈리기 쉬운 부분이 있다. `count`는 `const`다. `setCount(1)`을 호출한다고 해서 기존 `count` 변수의 값이 1로 **바뀌는 게 아니다**. React가 내부에 저장한 state를 1로 바꾸고 컴포넌트 함수를 **다시 호출**하면, 그 새 호출에서 `useState`가 1을 돌려주고 **새로운 `count` 변수**가 만들어지는 것이다.

React 없이 순수 JS로 흉내 내보면 이렇다.

```js
function render(count) {
  // 이 render 호출 안에서만 유효한 count
  const callback = () => console.log(count);
  return callback;
}

const callbackFromRender1 = render(0);
const callbackFromRender2 = render(1);

callbackFromRender1(); // 0
callbackFromRender2(); // 1
```

두 콜백은 같은 코드로 만들어졌지만 서로 다른 호출(스코프)에서 태어났기 때문에 각자 다른 `count`를 본다. 렌더링 2가 일어났다고 해서 렌더링 1에서 만들어진 콜백이 보는 값이 바뀌지는 않는다.

### 예제에 대입해 보면

```
Counter() 1번째 호출 (스코프 A)
  count = 0
  useEffect 실행 → setInterval 등록
  interval 콜백은 스코프 A를 붙잡음 → 이 콜백에게 count는 영원히 0

Counter() 2번째 호출 (스코프 B)
  count = 1
  useEffect → 의존성 배열 []이라 실행 안 함
  → 스코프 B에서는 새 콜백이 만들어지지 않음

1초마다 실행되는 건 여전히 스코프 A의 콜백 → setCount(0 + 1)
```

스코프 B의 `count = 1`은 화면에 그려지는 데만 쓰이고, interval 콜백은 그 존재를 모른다. 이렇게 **오래된 스코프의 값을 붙잡고 있는 클로저**를 stale closure라고 부른다.

### 왜 1에서 멈추고 더 이상 렌더링도 안 되나

두 번째 이후 `setCount(0 + 1)`은 현재 state와 같은 값 1을 넣는다. React는 새 값이 이전 값과 같으면(`Object.is` 비교) 리렌더링을 건너뛴다. 그래서 interval은 계속 돌고 있지만 화면은 1에 멈춰 있다.

콜백 안에 `console.log(count)`를 넣어보면 매 초 `0`이 찍히는 걸 볼 수 있다. 화면에는 1이 떠 있는데 콜백은 0을 보고 있는 것이다.

```js
const interval = setInterval(() => {
  console.log(count); // 0, 0, 0, ...
  setCount(count + 1);
}, 1000);
```

### 해결의 방향

원인이 "콜백이 오래된 스코프의 `count`를 읽는 것"이니 해결 방법도 세 가지 방향 중 하나다.

1. 콜백이 바깥 `count`를 **아예 읽지 않게** 한다 → 함수형 업데이트
2. 값이 바뀔 때마다 **새 스코프에서 콜백을 다시 만든다** → 의존성 배열에 `count` 추가
3. 렌더링과 상관없이 **항상 같은 객체**를 통해 최신 값을 읽는다 → `useRef`

## 해결 방법

### 1. 함수형 업데이트 사용

가장 간단한 방법이다. `setState`에 값 대신 함수를 넘기면 React가 **최신 state**를 인자로 넣어준다. 콜백이 `count`를 직접 참조하지 않으니 클로저 문제가 사라진다.

```js
useEffect(() => {
  const interval = setInterval(() => {
    setCount((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

### 2. 의존성 배열에 state 추가

```js
useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [count]);
```

동작은 하지만 `count`가 바뀔 때마다 interval을 지우고 새로 만든다. 사실상 `setTimeout`을 매번 다시 거는 것과 같아서 간격이 미묘하게 밀릴 수 있다.

### 3. useRef로 최신 값 참조하기

state를 업데이트하는 것 말고 콜백 안에서 **최신 state를 읽어야 할 때**(예: 최신 값으로 API 호출)는 함수형 업데이트로 해결이 안 된다. 이럴 때는 `useRef`에 최신 값을 담아두고 읽는다.

```js
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);

useEffect(() => {
  const interval = setInterval(() => {
    console.log("현재 count:", countRef.current);
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

`ref` 객체는 렌더링이 바뀌어도 같은 객체가 유지되기 때문에 콜백이 항상 최신 값을 읽을 수 있다.

## 정리

| 상황 | 방법 |
|---|---|
| 이전 state 기준으로 업데이트만 하면 됨 | 함수형 업데이트 `setState(prev => ...)` |
| 콜백 안에서 최신 state를 읽어야 함 | `useRef`에 최신 값 저장 |
| interval 재생성이 상관없음 | 의존성 배열에 state 추가 |

## 참고

- [React 공식 문서 - useState](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state)
- [Making setInterval Declarative with React Hooks - Dan Abramov](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)
