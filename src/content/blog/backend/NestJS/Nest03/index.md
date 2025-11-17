---
title: InputType vs ArgsType
description: 'InputType vs ArgsType InputType GraphQL의 Mutaion 인자로 object를 받아야 하는 경우 input type 을 사용한다. 아래와 같이 사용한다. Mutation을 구현하는 resolver 에서 Input type을 사용하기 위해서는 의 인자로 이름 을 넘겨줘야한다. 이렇게 작성한…'
pubDate: 2021-05-16 18:31:24
category: NestJS
tags:
  - NestJS
  - ArgsType
  - InputType


---



## InputType

GraphQL의 Mutaion 인자로 object를 받아야 하는 경우 **input type**을 사용한다. 아래와 같이 사용한다.

```js
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class UpvotePostInput {
  @Field()
  postId: number;
}
```

Mutation을 구현하는 resolver 에서 Input type을 사용하기 위해서는 `@Args()` 의 인자로 **이름**을 넘겨줘야한다.

```js
@Mutation(returns => Post)
async upvotePost(
  @Args('upvotePostData') upvotePostData: UpvotePostInput,
) {}
```

이렇게 작성한 경우 mutation은 아래와 같이 작성한다.

```graphql
mutatiln {
    upvotePost(
        upvotePostData: {
            name: '',
            something: '',
        }
    )
}
```

## ArgsType()

분리된 값들을 graphql 인자로 전달해준다. @InputType()과 달리 이름을 쓰지 않아도 된다.

```js
@Mutation(returns => Post)
async upvotePost(
  @Args('') upvotePostData: UpvotePostInput,
) {}
```

## ObjectType()

`@ObjectType()` 데코레이터를 줌으로써 자동으로 graphql 스키마를 생성하도록 한다. 이로써 graphql 스키마 정의와 entity 정의를 한 번에 할 수 있다.

- restaurant.entity.ts

```js
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Restaurant {
  @Field((type) => String)
  name: string;
  @Field((type) => Boolean, {nullable: true})
  isGood?: boolean
}
```
