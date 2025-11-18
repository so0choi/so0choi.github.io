---
title: Cloudwatch Log Insights query
description: 'Cloudwatch Log Insights는 로그 그룹을 쿼리하는 데 사용할 수 있는 쿼리 언어를 지원한다. 로그 유형의 필드를 검색하고 기호로 시작하는 필드를 자동으로 생성한다. Cloudwatch 로그를 일일이 뒤지고 싶지 않다면 사용법을 알아두는게 좋다. 쿼리 명령어 | 명령어 | 설명 | | | | | displ…'
pubDate: 2021-12-13 14:09:59
tags:
  - AWS
  - Cloudwatch
category: cloud




---


Cloudwatch Log Insights는 로그 그룹을 쿼리하는 데 사용할 수 있는 쿼리 언어를 지원한다. 로그 유형의 필드를 검색하고 `@` 기호로 시작하는 필드를 자동으로 생성한다. Cloudwatch 로그를 일일이 뒤지고 싶지 않다면 사용법을 알아두는게 좋다.

## 쿼리 명령어

| 명령어  | 설명                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------------ |
| display | 쿼리 결과에 표시할 필드를 지정                                                                         |
| fields  | 로그 이벤트에서 지정된 필드를 검색                                                                     |
| filter  | 조건을 기반으로 쿼리 결과를 필터링                                                                     |
| stats   | 로그 필드 값을 사용하여 집계 통계를 계산. `by`와 함께 사용하여 기준을 지정해 데이터를 그룹화할 수 있음 |
| sort    | 검색된 로그 이벤트를 정렬                                                                              |
| limit   | 쿼리에서 반환되는 로그 이벤트 수를 지정 (기본값은 최대 1,000개)                                        |
| parse   | 로그 필드에서 데이터를 추출하고, 쿼리에서 추가로 처리할 수 있는 임시 필드 생성                         |

## 사용 예

### timestamp 범위 내 로그 쿼리

```
fields @timestamp, @message
| fields tomillis(@timestamp) as millis
| filter millis > 1639162500000  # 2021년 12월 11일 토요일 오전 3:55:05 GMT+09:00
     and millis < 1639162510000  # 2021년 12월 11일 토요일 오전 3:55:10 GMT+09:00
```



## 참고

- [CloudWatch Logs Insights 쿼리 구문](https://docs.aws.amazon.com/ko_kr/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)