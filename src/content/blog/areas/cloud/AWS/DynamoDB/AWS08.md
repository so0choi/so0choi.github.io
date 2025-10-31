---
title: AWS - DynamoDB2
description: 'DynamoDB 활용가능성 DynamoDB를 사용할 수 있는지 계속해서 활용방안을 생각해보고있다. 현 상황 재생량을 전송하는 작업에서 uuid로 구분되는 MySQL(RDBMS) 로그 데이터 테이블에 insert와 update가 빈번하게 발생하고 있다. 이를 개선시키고자 한다. 이슈 1. 재생량 전송 처리 서버를 분리한다…'
heroImage: '../../../../../../assets/posts/AWS08/2020-11-18-15-18-43.png'
pubDate: 2020-11-20 22:27:37
category: AWS
tags:
  - AWS
  - DynamoDB





---






# DynamoDB 활용가능성

DynamoDB를 사용할 수 있는지 계속해서 활용방안을 생각해보고있다.

## 현 상황

재생량을 전송하는 작업에서 uuid로 구분되는 MySQL(RDBMS) 로그 데이터 테이블에 insert와 update가 빈번하게 발생하고 있다. 이를 개선시키고자 한다.

### 이슈

1. 재생량 전송 처리 서버를 분리한다 (API 추출)
2. 데이터를 쌓는 과정과 조회 과정이 동시에 일어남에 따라 조회 지연이 길다.

## 해결방안

1. AWS DynamoDB(NoSQL)을 도입한다.
2. 기본키의 구성을 바꾼다.
3. 데이터 삽입 방법과 조회 방법을 바꾼다.
4. 메세지 큐를 사용해 주기적으로 데이터를 정해진 곳으로 전송하도록 한다.

## DynamoDB 사용해보기

![](../../../../../../assets/posts/AWS08/2020-11-18-15-18-43.png)

API Gateway로 재생량 전송 서버를 분리하여 api를 만든다. Lambda를 사용해 DynamoDB에 데이터를 저장한다.

현재 사용중인 `log data insert` 작업은 기본키인 uuid의 데이터를 계속해서 갱신하는 방식으로, `INSERT INTO ON DUPLICATE KEY UPDATE` 문을 사용하고 있다. DynamoDB는 Hash key 값과 같은 key 값을 가진 데이터를 insert 하려고 하면 자동으로 new data를 old data에 Overwrite 한다. 따라서 간단한 insert문으로 입력/갱신을 할 수 있는 것이다. (물론 Update 작업도 따로 제공된다)

Play data는 재생 로그 데이터의 수집이기 때문에 다른 테이블과의 관계가 없다. 데이터는 계속해서 insert 되기만 하고 로그 데이터라 양이 계속해서 쌓인다. DynamoDB는 데이터 용량이 제한되어있지않기 때문에 이번 작업에 사용하기에 적합한 툴로 보인다.

### 이슈

1. 데이터를 입력할 때 `ddb.put` 메서드를 사용하는데 기본키가 같을 경우 DynamoDB는 기존 데이터에 새로운 데이터를 overwrite 한다. 이런 경우 update 연산이 빠른가 아니면 overwrite가 빠른가?

- [updating vs overwriting items from dynamodb](https://stackoverflow.com/questions/47599149/updating-vs-overwriting-items-from-staging-tables-in-dynamodb)
- [dynamodb performance comparision](https://stackoverflow.com/questions/46174669/amazon-dynamodb-performace-comparision-between-replacing-an-entire-item-using-p)

실제로 속도에서 큰 차이는 없다고 한다. 각 메서드들을 호출하는 방식에 차이가 있는데, put 은 value 전체를 바꾸는 것이기 때문에 바꿀 데이터 전체를 입력해야 하고, update는 바꿀 항목 하나만 작성하면 된다는 것이다. 때문에, 만약 큰 data record에서 작은 하나의 항목만 수정하면 되는 경우에는 Update를 사용하는 것이 좀 더 경제적이다.

현재와 같은 방식으로 데이터를 쌓는다면 update/put의 차이는 없어보인다.
