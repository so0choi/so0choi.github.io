---
title: AWS AppSync DynamoDB Resolver update Add 사용
description: "AppSync DynamoDB Javascript Resolver에서 update increment, decrement는 이미 존재하는 row에 대해서만 작동하기 때문에 에러가 발생한다. 이는 update의 increment 사용시 DynamoDB 요청으로 변형되기 때문이다. 아래는 increment를 사용한 Javas…"
pubDate: 2024-01-24 16:59:13
tags:
  - AWS AppSync
category: cloud
---

AppSync DynamoDB Javascript Resolver에서 update increment, decrement는 이미 존재하는 row에 대해서만 작동하기 때문에 에러가 발생한다. 이는 update의 increment 사용시 DynamoDB `SET` 요청으로 변형되기 때문이다. 아래는 increment를 사용한 Javascript resolver의 요청 mapping template이다.

### javscript resolver

```js
import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const { streamId } = ctx.args.input;

  return ddb.update({
    key: { streamId },
    update: { currentView: ddb.operations.decrement(1) },
  });
}

export function response(ctx) {
  const { error, result } = ctx;
  console.log(result, error);
  if (error) {
    util.appendError(error.message, error.type);
  }
  return result;
}
```

### request mapping template

```json
{
  "update": {
    "expression": "SET #expName_1 = #expName_1 - :expValue_1",
    "expressionNames": {
      "#expName_1": "currentView"
    },
    "expressionValues": {
      ":expValue_1": {
        "N": 1
      }
    }
  },
  "operation": "UpdateItem",
  "key": {
    "streamId": {
      "S": "asdf"
    }
  }
}
```

row가 존재하지 않을 경우 `1`로 값을 증가시키려면 DynamoDB의 `ADD`를 사용해야 한다. AppSync Javascript resolver에서는 `@aws-appsync/utils/dynamodb` 라이브러리를 사용해야 해서 `ADD`를 임의로 사용하는 방법을 찾지 못했다. 그래서 Javascript resolver가 아닌 VTL resolver를 사용했다.

## 구성

```vtl
{
    "version" : "2017-02-28",
    "operation" : "UpdateItem",
    "key" : {
        "id" : $util.dynamodb.toDynamoDBJson($context.arguments.input.id)
    },
    "update" : {
        "expression" : "ADD totalView :one, currentView :one",
        "expressionValues": {
            ":one" : { "N": 1 }
        }
    }
}
```

## 테스트

vtl resolver를 작성하고 테스트 Input을 아래와 같이 입력한다.

```json
{
  "arguments": {
    "input": {
      "id": "asdf"
    }
  },
  "source": {},
  "result": {},
  "request": {},
  "prev": {}
}
```

테스트를 실행하면 mapping template이 출력된다.

```json
{
  "version": "2017-02-28",
  "operation": "UpdateItem",
  "key": {
    "streamId": {
      "S": "asdf"
    }
  },
  "update": {
    "expression": "ADD totalView :one, currentView :one",
    "expressionValues": {
      ":one": {
        "N": 1
      }
    }
  }
}
```
