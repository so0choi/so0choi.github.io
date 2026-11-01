---
title: NestJS, Graphql 연동
series: "NestJS 시작하기"
seriesOrder: 2
description: 'NestJS + Graphql 함께 사용해보기 \ \ Mutations\ \ Mutation은 GraphQL에서 서버 사이드 데이터를 modify 하는 방식이다. REST에서 GET 메서드의 요청은 데이터 수정을 하지 못하도록 하는게 원칙인 것 처럼 Query로 들어온 요청은 데이터를 수정하지 못한다. Nest에서는 데…'
pubDate: 2021-05-10 00:57:43
tags:
  - NestJS
  - GraphQL
category: backend




---


# NestJS + Graphql 함께 사용해보기

\*\*

## Mutations\*\*

![공식 도큐먼드 링크](https://docs.nestjs.com/graphql/mutations)

Mutation은 GraphQL에서 서버 사이드 데이터를 modify 하는 방식이다. REST에서 GET 메서드의 요청은 데이터 수정을 하지 못하도록 하는게 원칙인 것 처럼 Query로 들어온 요청은 데이터를 수정하지 못한다. Nest에서는 `@Mutation()` 데코레이터를 사용해서 구현할 수 있다. 구현하는데에 다양한 방식이 있지만 `Code first`를 사용했다.

### Code first

```JS
@Mutation(returns => Post)
async upvotePost(@Args({ name: 'postId', type: () => Int }) postId: number) {
  return this.postsService.upvoteById({ id: postId });
}
```

위의 코드는 아래와 같은 graphql 코드를 생성해낸다.

```graphql
type Mutation {
  upvotePost(postId: Int!): Post
}
```

`upvotePost` 메서드는 `postId`라는 파라미터를 인자로 받고 이를 전달해 서비스에 작성한 로직을 실행시킨다.
만약 mutation이 **object**를 인자로 받아야 한다면, **input type**을 이용해야 한다.

Inputtype은 특별한 성격의 object type을 의미하는데 **input type만이 인자로써 전달될 수 있다.** (이걸 몰라서 한참이나 헤맷다😢) 다른 기능들과 마찬가지로 `@InputType()` 데코레이터로 생성할 수 있다.

```js
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class UpvotePostInput {
  @Field()
  postId: number;
}
```

## InputType

`@InputType()` 은 option object를 인자로 받는다. 예를 들면 type의 설명을 전달 할 수 있다. TypeScript의 **metadata reflection system**(뭔지 모르겠다) 때문에 사용자는 `@Field()` 데코레이터를 꼭 써줘야 한다.
이제 @InputType을 작성했기 때문에 아래와 같이 작성이 가능하다.

```js
@Mutation(returns => Post)
async upvotePost(
  @Args('upvotePostData') upvotePostData: UpvotePostInput,
) {}
```
