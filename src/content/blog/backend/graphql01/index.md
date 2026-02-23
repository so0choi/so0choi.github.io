---
title: GraphQL 이란
description: '<style img + em { display: block; text align: center; } </style GraphQL은 페이스북에서 만든 쿼리언어이다. 등장한지 얼마 안됐음에도 불구하고 인기가 매우 가파르게 올라가고 있지만 아직 GraphQL을 이용한 open API를 제공하는 곳은 국내 및 해외를 포함해도…'
heroImage: './2021-01-16-19-52-52.png'
pubDate: 2021-01-14 00:15:40
tags:
  - GraphQL
category: backend






---

GraphQL은 페이스북에서 만든 쿼리언어이다. 등장한지 얼마 안됐음에도 불구하고 인기가 매우 가파르게 올라가고 있지만 아직 GraphQL을 이용한 open API를 제공하는 곳은 국내 및 해외를 포함해도 많지않다.

쿼리언어 즉, SQL과 마찬가지이다. 하지만 둘의 구조적 차이는 분명하다. SQL이 DB 시스템에 저장된 데이터를 효율적으로 가져오는 목적으로 만들어진 반면, GQL은 web client가 데이터를 서버로부터 효율적으로 가져오는 것을 목적으로 한다. 따라서 SQL은 백엔드 시스템에서 사용되는 반면, GQL은 주로 클라이언트 시스템에 호출된다.

GQL은 어느 특정 DB나 플랫폼에 종속적이지 않다. 일반적으로 GQL의 인터페이스간 송수신은 네트워크 레이어7의 HTTP POST 메서드와 웹소켓 프로토콜을 활용한다.

## Rest API vs GraphQL

API에 가장 흔하게 사용되는 것이 REST API이다. REST는 URL, METHOD를 조합하여 사용하기 떄문에 다양한 Endpoint가 존재한다. 반면 GQL은 단 **하나**의 Endpoint가 존재한다.

![](http://tech.kakao.com/files/graphql-mobile-api.png)_출처 : <https://blog.apollographql.com/graphql-vs-rest-5d425123e34b>_

REST를 사용할 때의 가장 큰 문제점은 **Over fetching**이다. 'Fetching'은 가져오다 라는 뜻이다. REST를 사용할 경우 API 작성자가 작성한 데이터 구조대로 모든 정보를 받아오게 된다. 필요한 정보가 `ID` 하나이더라도, `USER`에 대한 정보 객체 모두를 받아와야 하는 것이다.

이런 문제를 해결하기 위해 나온 것이 GraphQL이다. GraphQL에서는 얻고자하는 정보를 명시하여 사용한다.
얻고자 하는 속성을 명시하지 않으면 오류가 발생한다.

![](./2021-01-16-19-52-52.png)

![](./2021-01-16-19-53-43.png)

## 핵심 요소

GraphQL은 사용자가 직접 작성한 스키마로 동작한다. 스키마 파일의 파일명은 `schema.graphql`로 작성하는 것이 일반적이다. 스키마 파일에는 다음과 같은 요소들이 선언된다.

- Query

Query는 데이터베이스로부터 데이터를 가져올 때 사용한다. 쿼리의 결과는 JSON 형식으로 반환된다.

```graphql
type Query {
  쿼리명: 반환 타입[!]
}
```

- Mutation

Mutation은 데이터베이스의 내용을 수정할 때 사용한다.

```graphql
type Mutation {
  mutation이름(파라미터): 반환 타입[!]
}
```

스키마 파일 이외에 반환 로직을 작성하는 파일로 Resolver가 있다. GraphQL 서버는 Resolver를 찾아 Query와 Mutation에 이에 해당하는 함수를 실행한다.

```js
const resolvers = {
  Query: {
    getMovies: () => movies,
  },
  Mutation: {
    addMovie: (_, { name }) => {
      addMovie(name); // 미리 작성한 로직
    },
  },
};
```

# 참고

- [Kakao Tech - GraphQL 개념잡기](https://tech.kakao.com/2019/08/01/graphql-basic/)
- [GraphQL이란 무엇인가?](https://hellominchan.tistory.com/220#:~:text=Resolver%EB%9E%80%20%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8%EB%A1%9C%EB%B6%80%ED%84%B0%20%EC%9A%94%EC%B2%AD,%ED%95%98%EB%8A%94%20%ED%95%A8%EC%88%98%EB%A5%BC%20%EC%8B%A4%ED%96%89%ED%95%A9%EB%8B%88%EB%8B%A4.)
