---
title: Context
description: 'GraphQL에서 란 특정 실행에서 모든 resolver에 의해 공유되어지는 object를 말한다. 사용자 인증 정보나 현재 사용자 또는 데이터베이스 연결과 같은 데이터를 유지하는데 유용하다. 각 resolver에서 세번째 파라미터로 존재한다. context는 모든 모듈에서 공유되어지므로 GraphQL에 별다른 cont…'
pubDate: 2021-06-06 16:22:49
tags: GraphQL
category: GraphQL

---


GraphQL에서 `context`란 특정 실행에서 모든 resolver에 의해 공유되어지는 object를 말한다. 사용자 인증 정보나 현재 사용자 또는 데이터베이스 연결과 같은 데이터를 유지하는데 유용하다.

각 resolver에서 세번째 파라미터로 존재한다.

```js
const resolvers = {
  Query: {
    myQuery(root, args, context, info) {
      // ...
    },
  },
};
```

context는 모든 모듈에서 공유되어지므로 GraphQL에 별다른 context building API가 없는 것이다. context는 GraphQL 서버에 의해 관리되고 실행된다.

## 참고

- [GraphQL modules - context](https://www.graphql-modules.com/docs/essentials/context/)
