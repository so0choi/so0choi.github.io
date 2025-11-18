---
title: for in, for of, forEach의 차이
description: 'for in, for of, forEach의 차이 forEach 는 자료형의 prototype이다. 따라서 와 같은 유사 배열 자료형에 를 사용하기 위해서는 배열로 바꾸는 작업이 필요하다. 인자로 callback을 받는다. Array의 각 element를 callback 함수의 인자로 하나씩 넘겨준다. for ... i…'
pubDate: 2020-09-21 15:43:31
tags:
  - Javscript
category: frontend






---



- forEach

`forEach` 는 `Array` 자료형의 prototype이다. 따라서 `NodeList`와 같은 유사 배열 자료형에 `forEach`를 사용하기 위해서는 배열로 바꾸는 작업이 필요하다. 인자로 callback을 받는다. Array의 각 element를 callback 함수의 인자로 하나씩 넘겨준다.

```js
const arr = [1, 2, 3];

arr.forEach((element) => console.log(element * 2));
// 2
// 4
//6
```

- for ... in

`for in` 은 객체에서 `string` 형식의 `key`로 이루어진 요소들에 접근할 때 사용한다. 일반 배열에도 사용할 수 있지만 이 경우 배열의 `prototype`으로 지정한 메서드들도 함께 접근하므로 `key`에만 접근하고 싶다면 `keys()` 메서드로 `key`만 접근하도록 해야한다. 하지만 객체 데이터에만 사용하는게 제일 좋다.

```js
const obj = { a: 1, b: 2, c: 3 };
for (const key in obj) console.log(key, obj[key]);
// a 1
// b 2
// c 3
```

- for ... of

`for of`는 iterable한 객체를 순회할 때 사용된다. 그렇기 때문에 일반 객체는 순회할 수 없다.
iterable 객체에는 String, Array, array-like objects (e.g., arguments or NodeList), TypedArray, Map, Set,user-defined iterables 이 있다.

```js
const array1 = ["a", "b", "c"];

for (const element of array1) {
  console.log(element);
}
```

## Reference

- [MDN-for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
- [MDN-for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)
- [[JS] forEach, for in, for of의 차이](https://n-log.tistory.com/39)
