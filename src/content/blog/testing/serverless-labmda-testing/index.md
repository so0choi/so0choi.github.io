---
title: "[AWS] serverless AWS Labmda testing - SQS & DynamoDB"
description: 'AWS Lambda 테스트 코드를 작성한다. 나는 serverless 프레임워크 위에서 작업을 진행하고 있다. SQS 테스트 serverless 문서에 따라 ElasticMQ를 사용했다. 는 Amazon SQS와 호환 가능한 메시지 큐 시스템이다. Amazon SQS를 테스트 하고 싶을때도 많이 사용된다고 한다.'
pubDate: 2023-05-15 15:24:38
tags:
category: AWS

---


AWS Lambda 테스트 코드를 작성한다. 나는 serverless 프레임워크 위에서 작업을 진행하고 있다.

## SQS 테스트

serverless 문서에 따라 ElasticMQ를 사용했다. `ElasticMQ`는 Amazon SQS와 호환 가능한 메시지 큐 시스템이다. Amazon SQS를 테스트 하고 싶을때도 많이 사용된다고 한다.

