---
title: serverless environment variable
description: 'serverless 프레임워크에서 환경 변수를 사용하는 방법은 여러가지가 있다. 그중 가장 간단하다고 생각되는 방법은 비교적 나중에 추가된 기능인 파일을 그대로 읽어오도록 하는 방법이다. 적용 방법 serverless.yml serverless.yml 파일에 옵션을 true로 넣어주면 된다. serverless에서 지원…'
pubDate: 2024-03-25 10:50:50
category: cloud



---


serverless 프레임워크에서 환경 변수를 사용하는 방법은 여러가지가 있다. 그중 가장 간단하다고 생각되는 방법은 비교적 나중에 추가된 기능인 `.env` 파일을 그대로 읽어오도록 하는 방법이다.

## 적용 방법

- serverless.yml
```yml
useDotenv: true
```

serverless.yml 파일에 `useDotenv` 옵션을 true로 넣어주면 된다. serverless에서 지원하는 `.env` 파일은 `.env.{stage}` 파일과 `.env` 파일이다. 만약 두 파일이 모두 존재한다면 `.env.{stage}` 파일을 로드하며, 이 때 stage가 명시되지 않은 경우 `dev` 파일을 로드한다. 

### env 파일 작성

여느 ENV 파일과 같은 방식으로 작성하면 된다.

```dotenv
BASE_URL=my.api.com
PROTOCOL=https
```

### serverless.yml 파일에 환경 변수 정의

.env 파일에 등록한 변수는 serverless의 provider.environment에서 다시 한번 명시해야 한다. 이때 `${env:[변수명]}`으로 불러올 수 있다.

```yml
service: my-service
frameworkVersion: '3'

useDotenv: true

provider:
  name: aws
  runtime: nodejs20.x
  profile: default
  region: ap-northeast-2
  environment:
    NODE_ENV: ${opt:stage, 'dev'}
    BASE_URL: ${env:BASE_URL}
    PROTOCOL: ${env:PROTOCOL}
```

## 참고
- [serverless - environment variables](https://www.serverless.com/framework/docs/environment-variables)
