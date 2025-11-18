---
title: "[AWS] DLQ(Dead Letter Queue) 리드라이브"
description: 'DLQ SQS에서 란 성공적으로 처리되지 않은 메세지를 담고있는 큐를 말한다. DLQ는 자동으로 설정되는 것은 아니고, 일단 큐를 생성한 후 해당 큐를 다른 큐의 DLQ로 설정하여 사용할 수 있다. DLQ도 소스 큐와 같은 유형의 큐여야 한다. FIFO 큐의 DLQ는 FIFO 큐가 되어야 하는 것이다. (스탠다드 큐도…'
heroImage: './202306191107.png'
pubDate: 2023-05-23 10:48:52
category: cloud
tags:
  - SQS






---



## DLQ

SQS에서 `DLQ(dead-letter queue)`란  성공적으로 처리되지 않은 메세지를 담고있는 큐를 말한다. DLQ는 자동으로 설정되는 것은 아니고, 일단 큐를 생성한 후 해당 큐를 다른 큐의 DLQ로 설정하여 사용할 수 있다. DLQ도 소스 큐와 같은 유형의 큐여야 한다. FIFO 큐의 DLQ는 FIFO 큐가 되어야 하는 것이다. (스탠다드 큐도 같다) DLQ는 큐 생성 시에도 설정할 수 있고 생성 후에도 큐 편집 메뉴의 `배달 못한 편지 대기열`에서 설정 가능하다.

## DLQ 리드라이브

![](./202306191107.png)

정상 처리되지 못한 메세지를 DLQ에서 다른 큐로 보내는 것을 '리드라이브'라고 한다. 큐 리드라이브는 원래 메세지를 처리하는 소스 큐로 보내는 것이 일반적이지만 다른 큐에서 처리되도록 할 수도 있다. DLQ로 지정된 큐는 콘솔에서 `DLQ 리드라이브` 버튼이 활성화 된 것을 확인 할 수 있다. 

![](./202306191308.png)

이 때 메세지 처리 정책을 정할 수 있다. `maxReceiveCount`는 최대 재처리 횟수를 말한다. 모든 메세지는 `ReceiveCount` 값을 가지는데, 소스 큐에서 consume 될 때마다 카운트 값이 올라간다. `maxReceiveCount`를 5로 설정하고 메세지 처리에 다섯 번 실패하면 여섯 번 째 시도에서는 메세지를 처리하지 않고 설정된 DLQ로 메세지를 전송한다.

메세지 리드라이브는 API 또는 콘솔을 통해 실행할 수 있다. 자세한 건 [여기](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-dead-letter-queue-redrive.html)서 확인할 수 있다.

리드라이브 동작에 필요한 권한도 있으니 잘 참고하여 권한을 추가 해야겠다.
