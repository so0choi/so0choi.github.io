---
title: "Skipping start: DynamoDB Local is not available for stage Issue"
description: 'Serverless로 serverless dynamodb local 플러그인을 설치 후 실행시 오류가 발생했다. serverless.yml 코드를 추가 후 다시 실행하면 해결된다.'
pubDate: 2022-03-24 11:48:05
tags:
  - Serverless
  - DynamoDB local

---


Serverless로 serverless-dynamodb-local 플러그인을 설치 후 `dynamodb start` 실행시 오류가 발생했다.

```
Skipping start: DynamoDB Local is not available for stage: dev
```

## serverless.yml

```
custom:
  dynamodb:
    stages:
      - dev
```

코드를 추가 후 다시 실행하면 해결된다.
