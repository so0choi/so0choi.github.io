---
title: Kinesis
description: 'Amazon Kineses를 사용하면 실시간 스트리밍 데이터를 손쉽게 수집, 처리 및 분석할 수 있으므로 새로운 정보에 신속 대응할 수 있다. Amazon Kineses에서는 기계 학습, 분석 및 기타 애플리케이션을 위해 비디오, 오디오, 애플리케이션 로그 데이터와 같은 실시간 데이터를 수집할 수 있다. 중요 특징 실시…'
heroImage: '../../../../../assets/posts/AWS-kinesis/2022-10-07-01.png'
pubDate: 2022-03-17 15:15:02
tags:
  - Kinesis





---






Amazon Kineses를 사용하면 실시간 스트리밍 데이터를 손쉽게 수집, 처리 및 분석할 수 있으므로 새로운 정보에 신속 대응할 수 있다. Amazon Kineses에서는 기계 학습, 분석 및 기타 애플리케이션을 위해 비디오, 오디오, 애플리케이션 로그 데이터와 같은 실시간 데이터를 수집할 수 있다.

## 중요 특징

- 실시간 : 실시간 스트리밍 데이터를 수집 및 처리할 수 있다.
- 완전관리형 : 사용자가 인프라를 관리할 필요가 없다.
- 확장성 : 매우 짧은 지연 시간으로 수많은 소스의 데이터를 처리할 수 있다.

### Kinesis Data Streams

거대한 데이터 스트림을 실시간으로 다룰 수 있는 서비스이다. 실시간으로 데이터 지표를 확인하고 처리 및 분석 작업이 가능하다. 가장 보편적으로 사용하는 케이스는 실시간 데이터 집계가 있다. 데이터를 집어넣고 처리를 위해 불러오는데 걸리는 시간인 'put-to-get delay'는 1초 이하이다. 데이터가 들어오자마자 즉각적으로 사용할 수 있다고 봐도 무방하다.

![kinesis architecture](../../../../../assets/posts/AWS-kinesis/2022-10-07-01.png)

- producer: Kinesis Data Streams에 지속적으로 데이터를 넣는 주체
- consumer: Amazon EC2 또는 Amazon Kinesis Firehose로 처리 결과를 Amazon DynamoDB, Redshift, S3 등에 저장하는 주체
- shard: Kinesis data stream은 샤드로 이루어져있다. 각 샤드는 data record들로 이루어져있고 각 data record는 sequence number를 가지고있다.
- data record: Kinesis data stream에서 저장되는 데이터의 단위이다. sequence number, partition key와 data blob으로 이루어져있다. data blob의 최대 크기는 1MB이다.
- capacity mode
  - on-demand mode: 자동으로 샤드의 수가 관리된다.
  - provisioned mode: data stream에 대한 샤드 수를 직접 지정해야 한다.



## 참고

- [Amazon Kinesis Streams Developer Guide](https://docs.aws.amazon.com/streams/latest/dev/introduction.html)