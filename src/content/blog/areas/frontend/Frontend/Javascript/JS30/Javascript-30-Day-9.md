---
title: Javascript 30 - Day 9
description: 'Javascript30 Day9 Dev Tools Domination Javascript로 수행하는 동작을 확인하기 위해서는 data들을 콘솔 창에 출력해봐야 한다. 주로 가 사용되는데 개발에 도움이 되는 비슷한 여러 함수들이 있다. console.log() 콘솔 창에 인자로 받은 문자열을 그대로 출력한다. 키워드를 사…'
pubDate: 2020-08-21 22:39:25
tags:
  - Javascript
  - Javascript30
category: Javascript

---

# Javascript30 Day9 - Dev Tools Domination
Javascript로 수행하는 동작을 확인하기 위해서는 data들을 콘솔 창에 출력해봐야 한다. 주로 `console.log()`가 사용되는데 개발에 도움이 되는 비슷한 여러 함수들이 있다.

## console.log()
```js
console.log('Hello');
```
콘솔 창에 인자로 받은 문자열을 그대로 출력한다.

```js
console.log('Hello, %s',value);
```
`%s` 키워드를 사용해 값을 문자열에 치환하여 출력할 수도 있다. ES6 문법을 사용하면 아래처럼 쓸 수도 있다.
```JS
console.log(`Hello, ${value}!`);
```

`%c` 키워드를 사용해 출력 스타일을 지정할 수 있다. 스타일은 기본 css와 같은 문법이다.
```js
console.log(
        "%c I am some great text",
        "font-size:30px; background: red; text-shadow: 10px 0 blue"
      );
```

## console.something()
`log` 뿐 아니라 다양한 정보를 출력 할 수 있다.
- `console.warn()`
- `console.error()`
- `console.info()`

## console.assert()
`console.assert()`는 bool을 반환하는 조건식과 문자열을 인자로 받아 조건식이 false일 경우에만 문자열을 출력한다.
```js
console.assert(1===2, 'that is wrong');
```
이 경우 문자열이 출력된다.

## console.clear()
콘솔 창 출력값들을 지운다.

## console.dir()
`console.log()` 로 HTML Element를 출력하면 해당 element 하나만 출력된다. `console.dir()`을 사용하면 해당 요소와 관련된 모든 속성, 예를 들어 child element, parents element 등 과 사용할 수 있는 method들이 나온다.

## console.group()
반복문을 통해 배열의 데이터를 출력할 때 데이터를 각 요소에 따라 보고 싶을 때 사용한다. 출력문의 시작과 끝에 선언해주면 console 창에서 요소마다 출력 값이 묶이게 되어 보기 편하다.
```js
dogs.forEach((dog) => {
    console.group(`${dog.name}`);
    console.log(`This is ${dog.name}`);
    console.log(`${dog.name} is ${dog.age} year old`);
    console.groupEnd(`${dog.name}`);
});
```
`console.groupCollapsed()`도 비슷한 기능을 한다. 이 경우 출력 당시부터 인자별로 더보기 단추 안에 축소 되어 출력된다.

## console.count()
인자로 들어온 문자열이 몇 번이나 출력되었는지 counting 한다. 중간에 다른 문자열이 출력되어도 count 정보는 초기화 되지 않는다.