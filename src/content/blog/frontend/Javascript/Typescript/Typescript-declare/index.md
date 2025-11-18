---
title: Typescript declare
description: '는 이미 다른 파일에서 정의된 변수를 사용할 때 type 오류가 발생하는 것을 막는 용도로 사용할 수 있다. html 파일에서 차례대로 load 되어서 값을 읽는데 문제가 없을 것임에도 Typescript는 해당 변수에 대한 정보를 알 수 없기 떄문이다. 문은 Javascript로 변환할 때 사라진다. 이렇게 정의된 변…'
pubDate: 2023-02-02 14:28:06
category: frontend
tags:
  - typescript




---


`declare`는 이미 다른 파일에서 정의된 변수를 사용할 때 type 오류가 발생하는 것을 막는 용도로 사용할 수 있다. html 파일에서 차례대로 load 되어서 값을 읽는데 문제가 없을 것임에도 Typescript는 해당 변수에 대한 정보를 알 수 없기 떄문이다.

```ts
declare const a :number;

console.log(a) // no type error
```

`declare`문은 Javascript로 변환할 때 사라진다. 

이렇게 정의된 변수들은 테스트 코드를 실행하면 오류가 발생하기 때문에 `gloabl`에 선언해두고 테스트를 진행했다.

```ts
  beforeAll(() => {
    (global as any).fruit = {
        apple: 'apple'
    };
  });
```
