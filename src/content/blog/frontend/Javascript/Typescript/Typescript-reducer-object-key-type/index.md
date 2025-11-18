---
title: Typescript reducer object key type
description: '문제 를 이용해 빈 객체에 대상 배열의 string 값을 key로 사용해 값을 지정하려고 했더니 타입 에러가 발생했다. 해결법 reducer의 초기 값으로 넣은 empty object에 타입이 지정되지 않아 생기는 문제다. 로 지정하면 된다.'
pubDate: 2023-09-05 09:41:47
category: frontend
tags:
  - typescript




---


## 문제

`reduce`를 이용해 빈 객체에 대상 배열의 string 값을 key로 사용해 값을 지정하려고 했더니 타입 에러가 발생했다.

```ts
const arr = [{name: 'a', value: 'val-a'}, {name: 'b', value: 'val-b'}, {name: 'c', value: 'val-c'}];

const names = arr.reduce((acc, cur) => {
    acc[cur.name] = cur[value];
}, {})
```

> acc[key] Element implicitly has an 'any' type because expression of type'string' can't be used to index type '{}'.

## 해결법

reducer의 초기 값으로 넣은 empty object에 타입이 지정되지 않아 생기는 문제다. `Record<string, any>` 로 지정하면 된다.

```ts
const arr = [{name: 'a', value: 'val-a'}, {name: 'b', value: 'val-b'}, {name: 'c', value: 'val-c'}];

const names = arr.reduce((acc, cur) => {
    acc[cur.name] = cur[value];
}, {} as Record<string, string>)
```



