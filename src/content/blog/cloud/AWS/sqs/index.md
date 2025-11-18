---
title: SQS Lambda Trigger
description: 'SQS Lambda Trigger란 Lambda trigger로 SQS를 등록할 수 있다. Standard 큐와 FIFO 큐 모두 지원한다. Lambda는 큐를 poll하여 가져온 큐 메시지로 동기적으로 Lambda 함수를 실행한다. Lambda는 batch안의 메시지들을 읽고 각 batch당 한 번씩 Lambda 함수…'
pubDate: 2022-04-14 10:53:17
category: cloud
tags:
  - AWS
  - SQS




---


> 업무에서 Standard 큐를 사용할 것이라 Standard 큐 기준으로 내용을 정리했다. FIFO 큐는 차이가 있는 부분이 있기 때문에 문서를 참고해야 한다.

## SQS Lambda Trigger란

Lambda trigger로 SQS를 등록할 수 있다. Standard 큐와 FIFO 큐 모두 지원한다.
Lambda는 큐를 poll하여 가져온 큐 메시지로 동기적으로 Lambda 함수를 실행한다. Lambda는 batch안의 메시지들을 읽고 각 batch당 한 번씩 Lambda 함수를 실행시킨다. 작업이 성공적으로 끝나면 Lambda는 자동으로 큐에서 메시지를 삭제한다.

default로 Lambda는 한 번에 10개의 메시지를 poll하여 해당 batch를 함수로 보낸다. 적은 record로 함수가 실행되는 것을 피하기 위해서 batch window를 설정하여 최대 5분까지 메시지를 더 polling하여 record를 더 채울 수 있도록 대기시킬 수 있다. 함수를 실행하기 전에 Lambda는 지속적으로 메시지를 poll하여 아래의 경우 함수를 실행시킨다.

- batch window의 만료
- 설정한 최대 batch size에 도달
- Lambda invocation quota에 도달 (6 MB)

> batch window를 사용하고있고 SQS 큐가 낮은 traffic으로 운영되고 있다면, batch window가 20초 보다 낮게 설정되어 있더라도 Lambda는 함수 실행 전 20초까지 대기할 수도 있다.

Lambda가 batch를 읽으면 해당 메시지는 큐에 남아있지만 큐의 visibility timeout 동안 숨겨진다(hidden). 함수가 성공적으로 batch를 처리하면 Lambda는 큐에서 메시지를 삭제한다. batch 처리 중 에러가 발생할 경우엔 batch내의 모든 메시지가 다시 visible 해진다. 이 때문에 함숙가 같은 메시지를 여러번 처리하게 될 수도 있어서 추가로 처리해야 한다. DynamoDB를 사용하면 좋다고 한다.

> [How can I prevent an Amazon SQS message from invoking my Lambda function more than once?](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-function-process-sqs-messages/?nc1=h_ls)

## SQS message event 예시

```js
{
    "Records": [
        {
            "messageId": "059f36b4-87a3-44ab-83d2-661975830a7d",
            "receiptHandle": "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...",
            "body": "Test message.",
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1545082649183",
                "SenderId": "AIDAIENQZJOLO23YVJ4VO",
                "ApproximateFirstReceiveTimestamp": "1545082649185"
            },
            "messageAttributes": {},
            "md5OfBody": "e4e68fb7bd0e697a0ae8f1bb342846b3",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:my-queue",
            "awsRegion": "us-east-2"
        },
        {
            "messageId": "2e1424d4-f796-459a-8184-9c92662be6da",
            "receiptHandle": "AQEBzWwaftRI0KuVm4tP+/7q1rGgNqicHq...",
            "body": "Test message.",
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1545082650636",
                "SenderId": "AIDAIENQZJOLO23YVJ4VO",
                "ApproximateFirstReceiveTimestamp": "1545082650649"
            },
            "messageAttributes": {},
            "md5OfBody": "e4e68fb7bd0e697a0ae8f1bb342846b3",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:my-queue",
            "awsRegion": "us-east-2"
        }
    ]
}
```

## Scaling and processing

Standard 큐에 대해서 람다는 long polling을 사용한다. 메시지가 수신되면 Lambda는 5개의 batch까지 읽어들이고 이를 function으로 보낸다. 메시지가 여전히 큐에 들어있다면 Lambda는 배치를 읽는 프로세스의 수를 분당 최대 60개 까지 늘린다. 이벤트 소스 매핑이 동시에 처리 가능한 최대 batch의 수는 1,000개이다.

## 큐 사용을 위한 Lambda 설정

Lambda의 이벤트 소스로 SQS 큐를 설정하면 된다.
큐에는 Lambda 함수가 각 이벤트 batch를 처리하는데 필요한 시간을 설정한다. 최소 함수에 설정한 timeout보다 6배를 큐의 visibility timeout으로 설정해야 batch를 처리할 수 있다. 추가적으로 부여된 시간은 이전 batch 처리 실패로 함수가 throttled 된 경우 등에서 Lambda가 작업을 재시도하는데 사용될 수 있다.

함수가 메시지 처리하는데 여러번 실패한 경우 SQS는 해당 메시지를 dead-letter 큐로 전송시킬 수 있다. 함수가 에러를 반환하면 Lambda는 그 메시지를 큐에 남겨두고 visibility timeout이 발생하면 Lambda는 그 메시지를 다시 받게 된다. 몇 번의 재시도 후에 다른 큐로 메시지를 보내고 싶다면 소스 큐에 dead-letter 큐를 설정해야 한다.

> dead-letter 큐는 소스 큐에서 설정해야 한다. Lambda 함수단에서 설정하는 dead-letter 큐는 이벤트 소스 큐를 위한 것이 아니라 Lambda 함수의 비동기 실행 기능을 사용할 때 쓰는 큐이다.

## 이벤트 소스로 큐 설정 옵션

- Batch size: 각 batch에 전송할 record의 수. stard 큐의 경우 10,000개 record까지 설정할 수 있고, FIFO 큐의 경우 10개가 최대이다. batch size를 10 이상으로 설정한 경우 `MaximumBatchingWindowInSeconds`도 최소 1초로 설정해야한다.
- Batch window: 함수를 호출하기 전에 record를 모을 수 있는 최대 시간. 초단위이며 standard 큐에만 설정할 수 있다. 0 이상의 batch window를 설정한 경우 증가된 처리 시간을 고려하여 큐의 visibility timeout을 설정해야 한다. 공식 문서에서는 함수의 timeout의 6배로 설정할 것을 권고하고있다.

## Reporting batch item failures

Lambda 실행 중 에러가 발생하면 default 동작으로 batch내 모든 메시지가 visible 된다. 이때 이미 정상적으로 처리된 메시지도 함께 큐에 다시 보이게 된다. 결과적으로는 같은 메시지가 여러번 처리될 수 있는 것이다.
이를 피하기 위해서 이벤트 소스 매핑 설정에서 처리에 실패한 메시지만 다시 visible 되도록 설정 할 수 있다. `FunctionResponseTypes` 리스트에 `ReportBatchItemFailures`를 추가하면 된다. 이렇게 하면 부분적인 success를 반환하도록 하여 불필요한 재처리를 줄일 수 있다.

### syntax

`ReportBatchItemFailures`를 설정하면 함수의 reponse에 처리에 실패한 메시지 아이디 리스트를 포함시킬 수 있다. 예를 들어 메시지 ID가 `id1`, `id2`, `id3`, `id4` 인 메시지들이 있고 `id2`, `id3`을 처리하는데 실패 했다면 response syntax는 다음과 같은 모양이어야 한다.

```js
{
  "batchItemFailures": [
        {
            "itemIdentifier": "id2"
        },
        {
            "itemIdentifier": "id3"
        }
    ]
}
```

실제 코드로 구현하면 아래와 비슷한 모양이 될 것 이다.

```js
import {
  Handler,
  SQSEvent,
  SQSBatchResponse,
  SQSBatchItemFailure,
} from "aws-lambda";

class BatchItemFailure implements SQSBatchItemFailure {
  itemIdentifier: string;
  constructor(itemIdentifier: string) {
    this.itemIdentifier = itemIdentifier;
  }
}

class BatchResponse implements SQSBatchResponse {
  batchItemFailures: SQSBatchItemFailure[];
  constructor(batchItemFailures: SQSBatchItemFailure[]) {
    this.batchItemFailures = batchItemFailures;
  }
}

export const hanlder: Handler = async (
  event: SQSEvent,
  context
): Promise<SQSBatchResponse> => {
  const batchItemFailures: BatchItemFailure[] = [];
  for (const record of event.Records) {
    try {
      // process each message
    } catch (err) {
      console.error(err);
      batchItemFailures.push(new BatchItemFailure(record.messageId));
    }
  }
  return new BatchResponse(batchItemFailures);
};
```

이 기능을 사용하기 위해서는 에러 핸들링이 매우 중요하다. 함수가 `batchItemFailures`를 반환하지 않고 에러를 throw 할 경우 batch 전체가 처리에 실패되었다고 여겨진다.

## 참고

- [AWS Lambda with SQS](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html)
