---
title: "[AWS] SQS batch item failures"
description: 'Snowball anti patterns SQS에서 실패 처리된 메세지 핸들링은 매우 중요하다. 보통의 경우 Lambda가 batch를 처리하다 에러가 발생하는 경우 전체 메세지가 큐에 다시 들어가게 된다. 예를 들어 배치 크기가 100인 경우 한 번에 100개의 메세지가 처리되는 건데 77번째 메세지 처리 중 에러가…'
pubDate: 2023-05-23 11:41:23
tags: SQS
category: AWS

---


## Snowball anti-patterns

SQS에서 실패 처리된 메세지 핸들링은 매우 중요하다. 보통의 경우 Lambda가 batch를 처리하다 에러가 발생하는 경우 전체 메세지가 큐에 다시 들어가게 된다. 예를 들어 배치 크기가 100인 경우 한 번에 100개의 메세지가 처리되는 건데 77번째 메세지 처리 중 에러가 발생 할 경우 성공적으로 처리된 메세지를 포함한 전체 100개의 메세지가 다시 큐에 나타나게 된다. 결과적으로 같은 메세지가 여러 번 처리될 것이다.

Dead-letter 큐가 있는 경우 실패한 메세지가 그곳으로 이동하겠지만 그렇지 않은경우 source 큐에 계속해서 다시 들어가게 되고 계속적인 메세지 처리 실패 후에는 유효 메세지 수 보다 실패했던 메세지의 수가 많아져 문제가 눈덩이처럼 불어날 것이다. 이 경우 아래와 같은 부가적인 문제들로 이어진다.

- 사용자 경험의 저하: batch 처리에 시간이 오래걸린다. 또는 전혀 처리되지 않을 수도 있다.
- 사용 비용 증가: SQS 메세지 수 증가와 재시도 수 증가는 비용의 증가로 이어진다.
- Lambda 처리 capacity가 줄어든다

## batch 부분 실패 기능

이를 방지하기 위해 batch 부분 실패 처리 기능을 사용할 수 있다. 실패 처리 된 메세지만 큐에 다시 보이도록 하는 것이다. 이 설정을 바꾸려면 `ReportBatchItemFailures` 옵션 설정을 수정해야 한다. 옵션이 활성화 될 경우, Labmda는 실행이 실패하여도 메세지 폴링 크기를 낮추지 않는다.
기본적으로 Labmda는 처리에 실패했을 때 실패 원인에 따라 다른 처리 방식을 가지고 있다.

- Labmda 함수 코드 레벨 에러: 에러가 발생할 경우 SQS 이벤트 소스에 매핑된 동시 처리량을 감소시키면서 Labmda 함수 실행을 재시도한다. 만약 실행이 계속해서 실패한다면 더이상 재시도 하지 않고 메세지를 드랍시킨다.
- throttling에 의한 실패: 에러가 발생할 경우 SQS 이벤트 소스에 매핑된 동시 처리량을 감소시키면서 Labmda 함수 실행을 재시도한다. 메시지의 timestamp가 큐의 visibility timeout을 초과하기 전까지 재시도 하며 해당 시점이 지나면 메세지를 드랍시킨다.

`ReportBatchItemFailures`를 활성화 하더라도 Labmda가 exception을 뱉는 경우 전체 batch가 실패한 것으로 간주된다. 또한 메세지 처리 순서가 중요한 FIFO 큐를 사용하는 경우 에러가 발생하면 순서가 엉키지 않도록 프로세스를 중단하고 실패한 메세지가 먼저 처리되도록 해야 한다.

## ReportBatchItemFailures 적용하기

### Lambda 설정

먼저 event source mapping의 UUID 값을 알아내야 한다. 터미널에 다음 명령어를 입력한다.

```shell
aws lambda list-event-source-mappings --event-source-arn [SQS 큐 arn]    
```

그럼 아래와 같은 결과가 나올 것이다.

```shell
{
    "EventSourceMappings": [
        {
            "UUID": "a1b2c3d4-5678-90ab-cdef-11111EXAMPLE",
             ... 
        }
    ]
}
```

UUID 값을 복사해놓고 아래 명령어를 입력하면 된다.

```shell
aws lambda update-event-source-mapping \
--uuid "a1b2c3d4-5678-90ab-cdef-11111EXAMPLE" \
--function-response-types "ReportBatchItemFailures"
``` 

### 코드 레벨 설정

이제 Lambda가 batch 처리 중 실패할 경우 실패한 메세지들만 모아서 반환하도록 해야 한다. 응답은 JSON 형식으로 `batchItemFailures`가 `itemIdentifier` 리스트를 가지고 있으면 된다. 

```json
{ 
  "batchItemFailures": [ 
        {
            "itemIdentifier": "id2"
        },
        {
            "itemIdentifier": "id4"
        }
    ]
}
```

### 사용 예

```typescript
import { SQSBatchItemFailure, SQSBatchResponse, SQSRecord } from "aws-lambda";

export class BatchItemFailure implements SQSBatchItemFailure {
    itemIdentifier: string;

    constructor(itemIdentifier: string) {
        this.itemIdentifier = itemIdentifier;
    }
}

export class BatchResponse implements SQSBatchResponse {
    batchItemFailures: SQSBatchItemFailure[];

    constructor(batchItemFailures: SQSBatchItemFailure[]) {
        this.batchItemFailures = batchItemFailures;
    }
}

export class SqsStreamHandler {
    batchItemFailures: BatchItemFailure[];
    records: SQSRecord[];
    
    constructor(records: SQSRecord[]) {
        this.records = records;
        this.batchItemFailures = [];
    }
    
    handleStreams = async (
        cb: Function,
      ): Promise<BatchResponse> => {
        let messageId = "";
        for (const record of this.records) {
            try {
                messageId = record.messageId;
                cb(record.body);
            } catch (err) {
                await this.deleteProcessedMessageIdFromDdb(messageId);
                this.batchItemFailures.push(new BatchItemFailure(messageId));
            }
        }
        return new BatchResponse(this.batchItemFailures);
    }
};
```

더 나은 방법도 있을 것 같은데 나는 일단 이런 식으로 만들었다.
