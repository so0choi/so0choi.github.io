---
title: "Docker --env-file 따옴표 문제 해결하기 (.env dotenv 차이)"
description: "env 파일 처리 중 로컬과 도커 이미지 컨테이너의 env 파일 처리 방식이 달라 오류가 발생했다."
pubDate: 2026-03-17 17:20:02
category: backend

---

env 파일 처리 중 로컬과 도커 이미지 컨테이너의 env 파일 처리 방식이 달라 오류가 발생했다. 에러 로그를 보니 DB 연결이 이루어지지 않았고 문제는 DB 비밀번호에 `#`이 들어가기 때문이었다. 

## 문제 원인 분석
dotenv를 써서 .env 파일을 작성하고 로드할 때 dotenv는 #을 주석처리한다. 하지만 Docker `run` 커맨드에 `--env-file`로 .env 파일을 넘기면 Docker는 따옴표까지 포함한 값 전체를 환경 변수로 인식한다.
`.env` 파일을 파싱하는 방식에 차이가 있기 때문에 발생한 문제이다.

- dotenv: DB_PASS="password#" → password# ✓
- docker --env-file: DB_PASS="password#" → "password#"  => 따옴표 포함!

dotenv에서는 # 이후 문자를 주석으로 처리하므로 꼭 따옴표로 감싸야한다.

## 해결 방법

몇 가지 해결 방법이 존재한다.

### 1. docker run을 사용하면서 env 변수 내에 `#` 문자를 사용하지 않는다.

가장 쉽고 간단한 방법이다. ㅎㅎ

### 2. shell 환경변수로 넘겨 docker run을 실행한다.

```shell
export DB_PASS="password#" docker run -e DB_PASS=$DB_PASS hello-world
```

### 3. docker compose 사용 - 채택 ✅

`docker-compose`는 `dotenv` 방식으로 env 파일을 파싱해서 따옴표를 올바르게 제거한다. 

```yml
services:
  player:
    image: hello-world
    env_file:
      - .env
    environment:
      - NODE_ENV=local
    ports:
      - "80:80"
```

## 결론

dotenv 기반 프로젝트에서 생성한 `.env` 파일을 문제없이 그대로 사용하려면 `docker run` 대신 `docker compose`를 사용하자.

