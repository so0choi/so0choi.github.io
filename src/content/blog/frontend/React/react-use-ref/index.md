---
title: React useRef hook 사용하기
description: '는 렌더링이 될 필요 없는 값을 참조하기 위한 리액트 훅이다. 사용법 는 라는 한 개의 프로퍼티를 가지는 object를 반환한다. 초기 값은 값이 된다. 값을 저장하고 있다는 점에서 와 비슷하게 느껴지지만 와 다르게 useRef는 프로퍼티를 수정하여 값을 바꿀 수 있다. (useState는 setValue 함수를 사용해…'
pubDate: 2023-02-20 09:42:04
tags:
  - React hooks
category: frontend





---


`useRef`는 렌더링이 될 필요 없는 값을 참조하기 위한 리액트 훅이다.

## 사용법

```js
const ref = useRef(initialValue)
```

`useRef`는 `current`라는 한 개의 프로퍼티를 가지는 `ref` object를 반환한다. 초기 값은 `initialValue` 값이 된다. 값을 저장하고 있다는 점에서 `useState`와 비슷하게 느껴지지만 `useState`와 다르게  useRef는 `current` 프로퍼티를 수정하여 값을 바꿀 수 있다. (useState는 setValue 함수를 사용해야 값을 수정할 수 있음)

`ref`는 단순 JavaScript object로 리액트는 값이 수정되었는지 어떤지 알 지 못한다. 그래서 `ref.current` 값이 바뀌어도 리액트는 화면을 re-render 하지 않는다. 

### 사용 예

```js
import { useRef } from 'react';

function Stopwatch() {
    const intervalRef = useRef(0);
}

function handleStartClick() {
    const intervalId = setInterval(() => {
        // ...
    }, 1000);
    intervalRef.current = intervalId;
}
```

## 주의할 점

렌더링이 발생하지 않기 때문에 화면에 실시간으로 수정사항이 표시되는 값을 저장할 때 사용하기에는 부적합하다. 하지만 그렇다고 그 값을 화면에 나타내지 않아야 하는 것은 아니다.

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

이런 경우 `ref`가 이벤트 핸들러 내부에서만 read/write 되기 때문에 사용하는 데 문제가 없다. 일반 JavaScript 변수를 사용하는 경우 화면이 렌더링 될 때 변수가 재정의 된다는 점이 둘의 차이점이다. 

렌더링 없이 상태 값을 저장할 때에는 `useRef`를, 실시간으로 변경되는 상태를 나타내기 위해서는 `useState`를, 단순 로직 계산에 사용하기 위해서는 일반 JS 변수를 사용하면 된다. 

## 참고
- [useRef vs. Regular Variable](https://stackoverflow.com/questions/74572123/useref-vs-regular-variable)
- [React Document](https://beta.reactjs.org/reference/react/useRef)
- [Difference between useRef and normal variable](https://stackoverflow.com/questions/57530446/difference-between-useref-and-normal-variable)
