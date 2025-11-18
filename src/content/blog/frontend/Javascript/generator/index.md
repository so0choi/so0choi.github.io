---
title: "[Javascript] Generator"
description: 'Generator 는 여러 개의 값을 필요에 따라 하나씩 반환( )할 수 있는 함수이다. 일반 함수는 하나 또는 0개의 값만을 반환할 수 있다는 것이 둘의 차이점이다. 실행되는 순서에 따라 동적으로 값을 반환한다는 것이 핵심이다. 사용법 제너레이터 함수 생성하기 제너레이터 함수는 키워드를 사용해 생성한다. 일반적인 함수…'
pubDate: 2020-09-20 17:36:47
category: frontend
tags:
  - Generator
  - ES6
  - Javascript




---


# Generator

`제너레이터` 는 여러 개의 값을 필요에 따라 하나씩 반환(`yield`)할 수 있는 함수이다. 일반 함수는 하나 또는 0개의 값만을 반환할 수 있다는 것이 둘의 차이점이다. 실행되는 순서에 따라 동적으로 값을 반환한다는 것이 핵심이다.

## 사용법

### 제너레이터 함수 생성하기

제너레이터 함수는 `*` 키워드를 사용해 생성한다.

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
```

일반적인 함수와 굉장히 유사하게 생겼지만 동작 방식은 매우 다르다. 제너레이터 함수를 호출하면 제너레이터 함수 내부 코드가 실행되는 것이 아니라, `제너레이터 객체`가 반환된다.

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

let generator = gen();
console.log(generator); // Object [Generator] {}
```

제너레이터 내부 코드를 실행하기 위해서 `next()` 메서드를 사용한다. `next()`는 가장 가까운 `yield <value>` 문을 만날 때 까지 실행된다. `yield`는 산출하다는 의미인데, 생성된 제너레이터 객체는 `yield`문을 만나면 실행을 멈추고 `value`를 산출한다. (value 값이 없는 경우 `undefined`로 산출된다.)
또다시 `next()`를 호출하면 이전에 만나 실행을 종료했던 `yield` 다음 부터 동작이 재개된다.

`next()`는 두 프로퍼티를 가진 객체를 반환한다.

- `value` : 산출 값
- `done` : 제너레이터 내부 코드 실행이 모두 끝났으면 `ture`, 아니라면 `false`. `return`을 만날 경우 `true`로 반환된다.

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

let generator = gen();
console.log(generator.next()); //{ value: 1, done: false }
console.log(generator.next()); //{ value: 2, done: false }
console.log(generator.next()); //{ value: 3, done: false }
```

```js
function* gen() {
  yield 1;
  yield 2;
  return 3;
}

let generator = gen();
console.log(generator.next()); //{ value: 1, done: false }
console.log(generator.next()); //{ value: 2, done: false }
console.log(generator.next()); //{ value: 3, done: yes }
```

## 어디에 쓸 수 있을까

좋은 기능인 것 같은데 어떤 경우에 어떤식으로 써야할 지 감이 오지 않았다. 이 부분에 대해서 배울 수 있었던 글이 [TOAST Meetup - ES6의 제너레이터를 사용한 비동기 프로그래밍](https://meetup.toast.com/posts/73) 글이다.

일단은 개념 정리를 해두고 프로젝트에서 비동기 로직을 짤 때 사용해볼 생각이다.

## Reference

- [코어 자바스크립트-제너레이터와 비동기 이터레이션](https://ko.javascript.info/generators)
- [TOAST Meetup - ES6의 제너레이터를 사용한 비동기 프로그래밍](https://meetup.toast.com/posts/73)
