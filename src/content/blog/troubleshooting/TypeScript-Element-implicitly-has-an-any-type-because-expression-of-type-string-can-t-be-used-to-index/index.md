---
title: "TypeScript : Element implicitly has an 'any' type because expression of type 'string' can't be used to index"
description: '타입스크립트 에러가 발생했다. 실행에는 문제가 없었지만 빨간 줄이 너무 거슬렸다. index signature 관련 에러였다. Index Signature Javascript에서 Object에 문자열로 접근할 수 있다. 이 때 암묵적으로 을 호출하기 때문에 Typescript는 이 때 오류를 발생시킨다. 에러를 보면 알…'
pubDate: 2023-03-22 10:00:51
tags: Typescript
category: Error
---


타입스크립트 에러가 발생했다. 실행에는 문제가 없었지만 빨간 줄이 너무 거슬렸다.

```ts
const CONN_STATE = {
  1: '준비',
  2: '송출',
  3: '종료',
  4: '일시 중지',
};

console.log(CONN_STATE[stream.ConnState])
// Error
```

> TS7053: Element implicitly has an 'string' type because expression of type 'string' can't be used to index type `{ 1: string; 2: string; 3: string; 4: string; }`.

index signature 관련 에러였다.

## Index Signature

Javascript에서 Object에 문자열로 접근할 수 있다. 이 때 암묵적으로 `toString`을 호출하기 때문에 Typescript는 이 때 오류를 발생시킨다.

```ts
let obj = {
  toString(){
    return 'Hello'
  }
}

let foo: any = {};

// 오류: index signature는 string, number 여야 함...
foo[obj] = 'World';

// FIX: TypeScript는 명시적으로 호출하게 강제함
foo[obj.toString()] = 'World';
```

에러를 보면 알 수 있다. Typescript에서 index signature는 `string` 또는 `number`여야 한다. (`symbols`도 사용할 수 있다고 한다.) Typescript는 index signature를 명시할 수 있도록 한다.

```ts
let foo:{ [key:string] : {message: string} } = {};

/** Ok */
foo['a'] = { message: 'some message' };
/** 오류: 타입이 string인 `message`가 있어야 함. `message` 부분에 오타 존재  */
foo['a'] = { messages: 'some message' };
```
여기서 index signature의`key`는 Typescript에서 가독성을 위해 넣는 아무 의미 없는 문자열이다. `index`라던지 `username` 라던지 아무 이름이나 넣어도 상관없다.

위의 에러는 index signature를 따로 명시하지 않기 때문에 객체 내부의 string literal을 key로 받게 되어있는데 string으로 객체에 접근하려고 해서 발생한 것이다.

## 해결 방법

객체에 `index signature`를 명시함으로써 해결 할 수 있다.

```ts
type ConnState = 1 | 2 | 3 | 4;

const CONN_STATE: {[key in ConnState]: string} = {
    1: '준비',
    2: '송출',
    3: '종료',
    4: '일시 중지',
};
```

## 참고
- [Indexing objects in TypeScript](https://dev.to/mapleleaf/indexing-objects-in-typescript-1cgi)
- [인덱스 서명(Index Signature)](https://radlohead.gitbook.io/typescript-deep-dive/type-system/index-signatures)
- [raccoon-ccoder.log](https://velog.io/@raccoon-ccoder/Error-TypeScript-Element-implicitly-has-an-any-type-because-expression-of-type-string-cant-be-used-to-index)
