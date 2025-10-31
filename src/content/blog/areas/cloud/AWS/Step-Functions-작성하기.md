---
title: Step Functions 작성하기
description: '나중에 또 쓸 일이 있을 것 같아서 기록해둔다. SQS에 쌓여있는 Queue를 10초에 한 번씩 처리하도록 했다. Step 10초에 한 번 람다를 실행시키는 Step Functions Stemp Functions 에서 실행시키는 iterator 람다는 아래와 같다.'
pubDate: 2022-09-02 09:53:13
tags:

---


나중에 또 쓸 일이 있을 것 같아서 기록해둔다.
SQS에 쌓여있는 Queue를 10초에 한 번씩 처리하도록 했다.

Step 

10초에 한 번 람다를 실행시키는 Step Functions 

```json
{
  "Comment": "Invoke Lambda every 10 seconds",
  "StartAt": "ConfigureCount",
  "States": {
    "ConfigureCount": {
      "Type": "Pass",
      "Result": {
        "index": 0,
        "count": 6
      },
      "ResultPath": "$.iterator",
      "Next": "Iterator"
    },
    "Iterator": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:ap-northeast-2:834444597251:function:dev-x-stepfunction-iterator",
      "ResultPath": "$.iterator",
      "Next": "IsCountReached"
    },
    "IsCountReached": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.iterator.continue",
          "BooleanEquals": true,
          "Next": "Wait"
        }
      ],
      "Default": "Done"
    },
    "Wait": {
      "Type": "Wait",
      "Seconds": 10,
      "Next": "Iterator"
    },
    "Done": {
      "Type": "Pass",
      "End": true
    }
  }
}
```

Stemp Functions 에서 실행시키는 iterator 람다는 아래와 같다.

```js
const aws = require('aws-sdk');
const lambda = new aws.Lambda({
    region: 'ap-northeast-2'
});

exports.handler = async(event, context) => {
    const index = event.iterator.index + 1;

    const vodParams = {
        FunctionName: "dev-kinx-midibus-playdata-vod-sqs-handler",
        InvocationType: 'Event',
    }

    lambda.invoke(vodParams, (err, data) => {
        if (err) console.log(err);
    });

    return {
        index,
        continue: index < event.iterator.count,
        count: event.iterator.count
    }
};

```

