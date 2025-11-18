---
title: "[Javascript] Closure란"
description: '클로저란 함수의 레퍼런스와 함수를 둘러싼 state, 즉 lexical 환경을 합쳐서 부르는 말이다. 클로저는 내부 함수에서 외부 함수 scope에 접근할 수 있도록 해준다. JavaScript에서 클로저는 함수가 생성될 때마다 함수 생성 시점에 클로저가 생성된다. Lexical scoping 아래 코드를 살펴보자. 은…'
pubDate: 2023-04-07 10:38:12
category: frontend



---


클로저란 함수의 레퍼런스와 함수를 둘러싼 state, 즉 lexical 환경을 합쳐서 부르는 말이다. 클로저는 내부 함수에서 외부 함수 scope에 접근할 수 있도록 해준다. JavaScript에서 클로저는 함수가 생성될 때마다 함수 생성 시점에 클로저가 생성된다.

## Lexical scoping

아래 코드를 살펴보자.

```js
function init() {
    var name = "Mozilla"; // name 은 init에서 만들어진 local variable이다
    function displayName() {
        // displayName() 은 내부 함수이다. 클로저를 형성한다.
        console.log(name); // 외부 부모 함수에서 만든 variable을 사용하고있다.
    }
    displayName();
}
init();
```

`init()`은 `name`이라는 local variable과 `displayName()`이라는 함수를 생성한다. `displayName()`은 `init()` 내부에 정의된 내부 함수이며 `init()` 함수의 body 안쪽에서만 사용이 가능하다. `displayName()` 함수에는 자체적인 local variable이 없지만, 내부 함수는 외부 함수의 variable에 접근이 가능하기 때문에 `displayName()`은 부모 함수인`init()`의 variable `name`에 접근이 가능하다.

이것이 *lexical scope*이다. 함수가 중첩되어있는 경우 parser가 variable의 이름을 보고 어떻게 처리하는지를 알 수 있다. *lexical*이라는 단어는 *lexical scoping*이 소스 코드에서 variable이 선언된 위치로 variable이 사용가능한 곳을 결정한다는 것을 나타낸다. 중첩된 함수는 함수 선언부 외부 scope에 접근할 수 있다.

위 예시의 scope는 *function scope*이다. variable이 함수가 선언된 body 내부에서만 접근 가능하기 때문이다.

## Scoping with let and const

ES6 이전에 JavaScript에는 *function scope*와 *global scope* 이렇게 두 가지 scope만이 존재했다. `var`로 선언된 variable은 함수의 내부에 선언되었는지 외부에 선언되었는지에 따라 두 scope중 하나로 결정되었다. 이 개념은 혼란을 가져올 수 있다. 중괄호로 만든 block이 아무런 scope를 만들지 않기 때문이다.

```js
if (Math.random() > 0.5) {
  var x = 1;
} else {
  var x = 2;
}
console.log(x);
```

C나 Java 같이 block이 scope를 생성하는 다른 언어를 사용하던 사람들은 위 코드가 `console.log` 라인에서 에러를 낼 것이라 생각할 것이다. 왜냐하면 `console.log`가 `x`가 선언된 block 내부에 위치하고 있지 않기 떄문이다.
그러나 JavaScript에서 block은 scope를 생성하지 않기 때문에 `var`는 실제로는 global variable이 된다.

ES6로 오면서 JavaScript는 `let`과 `const`를 도입하여 block-scoped variable을 만들 수 있게되었다.

```js
if (Math.random() > 0.5) {
  const x = 1;
} else {
  const x = 2;
}
console.log(x); // ReferenceError: x is not defined
```

마침내 ES6에서부터 block도 scope로 대우받기 시작했다. 물론 `let`이나 `const`를 사용해 variable을 선언하는 경우에 한해서이다. 

## Closure

아래 코드를 살펴보자

```js
function makeFunc() {
  const name = "Mozilla";
  function displayName() {
    console.log(name);
  }
  return displayName;
}

const myFunc = makeFunc();
myFunc();
```

위 코드를 실행하면 이전에 살펴봤던 `init()` 함수와 정확하게 같은 결과가 나타난다. 다른 점은 `displayName()` 이라는 내부 함수가 외부 함수에 의해 실행되기전에 return된다는 것이다.

처음 이 코드를 보면 이게 정말 동작하는 것이 직관적이지 않아 보일 것이다. 몇 프로그래밍 언어에서는, 함수 내부의 local variable들은 함수가 실행되는 동안에만 존재한다. `makeFunc()`가 실행을 마치면 `name` variable은 더 이상 접근할 수 없다고 생각할 수 있다. 하지만 코드는 정상적으로 동작한다. 즉 JavaScript는 그런 식으로 동작하는 게 아니라는 말이다.

위 코드가 정상적으로 동작하는 이유는 JavsScript에서 function은 클로저를 형성하기 때문이다. 클로저는 함수가 선언된 위치 내부의 lexical 환경과 함수를 합쳐서 부르는 단어이다. 이 환경은 클로저가 새엇ㅇ된 시점에 scope 내부에 있는 모든 local variable을 포함한다. 이 경우 `myFunc`는 `makeFunc`가 실행되면서 생성된 `displayName` 함수 인스턴스의 레퍼런스가 된다. `displayName`의 인스턴스는 `name` 변수가 위치하는 자신의 lexical 환경에 대한 레퍼런스를 유지하게 된다. 이와 같은 이유로 `myFunc`가 실행되었을 때 `name`은 사용 가능한 상태로 남아있게 되며 'Mozilla'는 `console.log`로 제대로 전달된다.

아래의 예를 살펴보자.

```js
function makeAdder(x) {
  return function (y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(2)); // 7
console.log(add10(2)); // 12
```

`makeAdder`은 function factory이다. argument로 받은 값에 특정 값을 더하는 함수를 생성해낸다. 위의 예시에서 이 factory는 두 개의 함수를 만들어낸다. 한 가지는 5를 더하고 다른 함수는 10을 더한다. 

`add5`와 `add10`은 모두 클로저를 형성한다. 둘은 같은 함수 정의를 공유하지만 서로 다른 lexical 환경을 가진다. `add5`의 lexical 환경에서 `x`는 5이고, `add10`의 lexical 환경에서 `x`는 10이다.

## 참고
- [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
