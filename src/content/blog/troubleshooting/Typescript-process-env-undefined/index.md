---
title: "[Error] Typescript process.env undefined 이슈"
description: '아무 세팅없이 를 사용하면 그 타입은 이다. 타입스크립트가 실제로 그 환경 변수가 있는지 알 수 없기 떄문이다. 그래서 타입에러가 가끔 발생한다. 이렇게 작성할 경우 생성자 파라미터 옵션이 모두 으로 되어있기 때문에 타입에러가 발생한다. 해결하기 위해서는 definition 파일을 작성하여 해당 변수가 이라는 것을 타입…'
pubDate: 2023-05-18 09:23:13
tags: Typescript
category: Error

---


아무 세팅없이 `process.env`를 사용하면 그 타입은 `string|undefined`이다. 타입스크립트가 실제로 그 환경 변수가 있는지 알 수 없기 떄문이다. 그래서 타입에러가 가끔 발생한다.

```ts
const dynamoDBClient = new DynamoDBClient({
    endpoint: process.env.DYNAMO_ENDPOINT,
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  })
```

이렇게 작성할 경우 `DynmoDBClient` 생성자 파라미터 옵션이 모두 `string`으로 되어있기 때문에 타입에러가 발생한다.

```
 TS2322: Type 'string | undefined' is not assignable to type 'string'.   Type 'undefined' is not assignable to type 'string'.
 ```

해결하기 위해서는 definition 파일을 작성하여 해당 변수가 `string`이라는 것을 타입 시스템에 알려주면 된다.

```ts
declare namespace NodeJS {
    interface ProcessEnv {
        DYNAMO_ENDPOINT: string;
        REGION: string;
        ACCESS_KEY: string;
        SECRET_ACCESS_KEY: string;
    }
}
```

파일을 저장하면 이제 `process.env`만 입력해도 자동완성이 가능하고 더 이상 에러가 발생하지 않는다.
