---
title: "AWS CodeBuild docker pull 429 에러 (Docker Hub rate limit) 해결"
description: "CodeBuild에서 베이스 이미지를 받다 간헐적으로 나는 429 에러의 원인인 Docker Hub pull rate limit과, Docker Hub 로그인·ECR Public·private ECR로 피하는 세 가지 방법을 정리했다."
pubDate: 2026-06-19 14:44:27
category: aws
tags: 
  - AWS
  - CodeBuild
---

Codebuild를 실행하던 중 docker pull로 베이스 이미지를 받아오는 과정에서 간헐적으로 에러가 발생했다.

```shell
aws codebuild
#4 [internal] load metadata for docker.io/library/node:22-alpine 
# 4 ERROR: failed to copy: httpReadSeeker: failed open: unexpected status from GET request to https://registry-1.docker.io/v2/library/node/manifests/sha256:e58326d0d441090181ac150dc2078d3e2cf6a0d42e809aebba3ef5880935ffdd: 429 Too Many Requests toomanyrequests: You have reached your unauthenticated pull rate limit. https://www.docker.com/increase-rate-limit 
# ------ 
# > [internal] load metadata for docker.io/library/node:22-alpine: 
# ------
# Dockerfile:15
# -------------------- 
# 13 | 
# 14 | 
# 15 | >>> FROM node:22-alpine AS builder 
# 16 | ENV NODE_ENV=production \ 
# 17 | NEXT_TELEMETRY_DISABLED=1 
# -------------------- 
# ERROR: failed to build: failed to solve: failed to copy: httpReadSeeker: failed open: unexpected status from GET request to https://registry-1.docker.io/v2/library/node/manifests/sha256:e58326d0d441090181ac150dc2078d3e2cf6a0d42e809aebba3ef5880935ffdd: 429 Too Many Requests toomanyrequests: You have reached your unauthenticated pull rate limit. https://www.docker.com/increase-rate-limit
```

에러를 읽어보면 docker pull rate limit에 걸렸다고 한다. 검색해보니 Docker hub의 이미지를 익명으로 pull 하는데는 rate limit이 있다고 한다.

## 해결 방법

1. Docker hub 로그인 후 pull 실행

가장 일차원적인 해결 방법은 docker hub에 로그인 한 후에 이미지를 받는 방식이다. buildspec.yml의 pre_build 단계에 로그인 커맨드를 추가하면 된다.

```yaml
phases:
  pre_build:
    commands:
      - echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
```

Codebuild 환경 변수에 필요한 변수를 추가해서 사용하면 된다.

2. ecr에 올라온 node 이미지 받기

Amazon ECR public이 docker hub 이미지를 복제해 가지고 있는 이미지를 사용하는 방법도 있다. limit이 없는 것은 아니다.

- 비로그인 이미지 pull: 초당 1번
- 인증된 사용자의 이미지 pull: 초당 10번

또한 비로그인 사용자의 pull은 월 500GB 전송 제한이 있다. 
하지만 public ecr을 사용할 경우 docker hub를 직접 접근하지 않기 때문에 docker hub rate limit을 피할 수 있다. codebuild가 하루에 엄청나게 많이 실행되지 않는다면 쓸만한 방법이다.

3. private ecr에 이미지 올려두고 사용하기

개인 ecr 접근은 제한이 없다. 따라서 사용할 이미지를 private ecr에 올려놓으면 얼마든지 접근이 가능하다.
