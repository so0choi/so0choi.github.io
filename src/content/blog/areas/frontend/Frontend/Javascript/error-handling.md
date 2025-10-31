---
title: Javascript 비동기 에러핸들링
description: '유틸 함수로 만든 함수에서 에러 핸들링에 작성한 코드가 작동하지 않는 것을 발견했다. 원인을 분석하다가 단단히 잘못 작성했다는 것을 깨달았다. 이렇게 코드를 작성할 경우 동기적으로 발생한 에러는 잡아낼 수 있지만, 메서드 실행으로 인한 비동기적으로 발생한 에러의 경우 가 없기 때문에 문으로 잡아낼 수 없다. 따라서 간단…'
pubDate: 2024-10-23 14:02:41
category: Javascript
tags:

---


유틸 함수로 만든 함수에서 에러 핸들링에 작성한 코드가 작동하지 않는 것을 발견했다. 원인을 분석하다가 단단히 잘못 작성했다는 것을 깨달았다.

```ts

const  update = async (
    tableName: string,
    PK: string,
    SK: string,
    updateExpressions: {
      UpdateExpression: string;
      ExpressionAttributeValues: Record<string, any>;
      ReturnValues?: ReturnValue;
      ExpressionAttributeNames?: Record<string, any>;
      ConditionExpression?: string;
    },
  ) => {
    try {
      const updateCommand = {
        TableName: tableName,
        Key: { PK, SK },
        ...updateExpressions,
      };
      // 비동기 함수 실행
      return docClient.send(new UpdateCommand(updateCommand));
    } catch (e) {
      console.error("DynamoDB error in update: " + JSON.stringify(e));
    }
  }
```

이렇게 코드를 작성할 경우 동기적으로 발생한 에러는 잡아낼 수 있지만, `send()` 메서드 실행으로 인한 비동기적으로 발생한 에러의 경우 `wait`가 없기 때문에 `try-catch`문으로 잡아낼 수 없다. 따라서 간단히 `await`를 추가하면 된다.

```ts

const  update = async (
    tableName: string,
    PK: string,
    SK: string,
    updateExpressions: {
      UpdateExpression: string;
      ExpressionAttributeValues: Record<string, any>;
      ReturnValues?: ReturnValue;
      ExpressionAttributeNames?: Record<string, any>;
      ConditionExpression?: string;
    },
  ) => {
    try {
      const updateCommand = {
        TableName: tableName,
        Key: { PK, SK },
        ...updateExpressions,
      };
      // 비동기 함수 실행
      return await docClient.send(new UpdateCommand(updateCommand));
    } catch (e) {
      console.error("DynamoDB error in update: " + JSON.stringify(e));
    }
  }
```

기본적인 부분에서 실수를 한 것 같은데 다시 실수하지 않으려고 글을 남겨놓는다. 하지만 사실 유틸 함수에서 에러 핸들링을 하는 것 보다 실행부에서 에러 처리를 하는 게 맞는 것 같아 `try-catch`문을 아예 빼버렸다.
