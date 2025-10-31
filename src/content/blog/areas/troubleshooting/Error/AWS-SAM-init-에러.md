---
title: AWS SAM init 에러
description: '에러 명령어로 stage stack을 생성하던 중 에러가 발생했다. 해결법 정해진 해결법은 없다. 구글링을 하면 aws credential이 잘못 설정된 문제라고 하기도 하고 cloud formation에서 생성이 실패한 스택을 직접 삭제 후 재배포 하면 된다는 글도 있었다. 나는 두 가지 방법으로는 해결되지 않았고 c…'
heroImage: '../../../../../assets/posts/AWS-SAM-init-에러/2022-03-18-16-30-28.png'
pubDate: 2022-03-18 16:25:05
tags: SAM
category: Error


---



## 에러

```
sam bootstrap
```

명령어로 stage stack을 생성하던 중 에러가 발생했다.

```
Error: Stack aws-sam-cli-managed-prod-pipeline-resources is missing Tags and/or Outputs information and therefore not in a healthy state (Current state:ROLLBACK_COMPLETE). Failing as the stack was likely not created by the AWS SAM CLI
```

## 해결법

정해진 해결법은 없다. 구글링을 하면 aws credential이 잘못 설정된 문제라고 하기도 하고 cloud formation에서 생성이 실패한 스택을 직접 삭제 후 재배포 하면 된다는 글도 있었다.

나는 두 가지 방법으로는 해결되지 않았고 cloud formation 대시보드에서 스택 이벤트로 들어가 로그를 확인해서 해결했다.

IAM 유저에 s3 권한이 없어서 생긴 문제였다 😃

![](../../../../../assets/posts/AWS-SAM-init-에러/2022-03-18-16-30-28.png)
