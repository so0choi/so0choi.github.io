---
title: Promise
description: 'Promise 는 비동기 로직을 구현할 때 유용하게 사용되는 기능이다. ES6부터 도입된 기능으로 JS의 다양한 비동기 함수들을 쉽게 컨트롤 할 수 있게 되었는데, Node.js 등에서 Promise를 사용하지 않으면 callback 지옥에 빠지게 된다. 구식 구현 방식.. 가독성이 정말 많이 떨어진다 ES6의 Prom…'
heroImage: './2020-09-13-22-17-53.png'
pubDate: 2020-09-13 22:05:27
tags:
  - Javascript
  - Promise
category: Javascript



---




`Promise`는 비동기 로직을 구현할 때 유용하게 사용되는 기능이다. ES6부터 도입된 기능으로 JS의 다양한 비동기 함수들을 쉽게 컨트롤 할 수 있게 되었는데, Node.js 등에서 Promise를 사용하지 않으면 callback 지옥에 빠지게 된다.

```js
doSomething(function (result) {
  doSomethingElse(
    result,
    function (newResult) {
      doThirdThing(
        newResult,
        function (finalResult) {
          console.log("Got the final result: " + finalResult);
        },
        failureCallback
      );
    },
    failureCallback
  );
}, failureCallback);
```

_구식 구현 방식.. 가독성이 정말 많이 떨어진다_

```js
doSomething()
  .then((result) => doSomethingElse(result))
  .then((newResult) => doThirdThing(newResult))
  .then((finalResult) => {
    console.log(`Got the final result: ${finalResult}`);
  })
  .catch(failureCallback);
```

ES6의 Promise와 Arrow function을 사용해 작성된 최신 문법의 js 코드이다. 훨씬 깔끔해졌다.

`Promise`는 객체이다.
![](./2020-09-13-22-17-53.png)

세가지 작업 상태가 있다.

- `pending` : Promise 객체를 생성하면 적용되는 초기 상태
- `fulfilled` : operation이 성공적으로 끝난 상태
- `rejected` : operation이 실패한 상태

기본적으로 지시한 동작이 `fulfilled`가 된 이후에 `.then` 키워드로 `chaining` 한 다음 작업이 순차적으로 실행된다.

작업이 실패해 `rejected`가 될 경우 `.catch`를 사용해 처리할 수도 있다.

```js
const myPromise = new Promise(myExecutorFunc)
  .then(handleFulfilledA)
  .then(handleFulfilledB)
  .then(handleFulfilledC)
  .catch(handleRejectedAny);
```

좀 더 현실적인 예시는 다음과 같다.

```js
const promiseA = new Promise((resolutionFunc, rejectionFunc) => {
  resolutionFunc(777);
});
// At this point, "promiseA" is already settled.
promiseA.then((val) => console.log("asynchronous logging has val:", val));
console.log("immediate logging");
```

## 예제

Promise로 인자를 넘겨주면서 실행해본다.

```js
function p(i) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(i, "번째");
      resolve(i);
    }, 1000);
  });
}

p(1)
  .then((i) => p(i + 1))
  .then((i) => p(i + 1))
  .then((i) => p(i + 1));
```

1초가 지날 때 마다 `1`씩 증가된 `i`가 출력된다.

이렇게 프로미스를 연결 할 때는 반드시 프로미스 객체를 반환해야 한다.

## Promise 선언 방식

Promise의 선언 방식에는 _1. 객체 선언_, _2. 함수 리턴_ 이렇게 두가지가 있다.
위의 예시들에서 두가지 방법을 모두 보여주고 있다.

같아 보이지만 사실 수행할 수 있는 기능이 조금씩 다르다.

항상 새로운 프로미스 객체를 생성해 반환하는 함수를 사용하는 경우, 함수를 호출할 때마다 프로미스 내부 작업이 실행된다.

하지만 한번 생성한 프로미스 객체를 계속해서 호출할 경우, 이미 내부 로직이 실행되었기 때문에 아무리 다시 호출한다고 해도 `resolve()`만 실행된다.

## Reference

[MDN-Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
