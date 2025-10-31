---
title: serverless esbuild로 패키지 사이즈 줄이기
description: 'serverless로 AWS Lambda를 패키징 하다보니 코드가 늘어날 수록 패키징 및 deploy 시간이 점점 더 늘어났다. 이대로 안되겠다 싶어 방법을 찾아보던 중 를 발견해 적용해보았는데 결과는 대만족! 설치 공식 홈페이지에서 자세한 옵션과 설치 및 적용 방법을 볼 수 있다. 적용 방법은 너무너무 간단하다. 그리…'
heroImage: '../../../../../assets/posts/serverless-esbuild/202411121606.png'
pubDate: 2024-11-12 15:41:39
category: AWS
tags:
  - serverless




---





serverless로 AWS Lambda를 패키징 하다보니 코드가 늘어날 수록 패키징 및 deploy 시간이 점점 더 늘어났다. 이대로 안되겠다 싶어 방법을 찾아보던 중 `esbuild`를 발견해 적용해보았는데 결과는 대만족!

## 설치
[공식 홈페이지](https://www.serverless.com/plugins/serverless-esbuild)에서 자세한 옵션과 설치 및 적용 방법을 볼 수 있다. 적용 방법은 너무너무 간단하다.

```
yarn add -D https://www.serverless.com/plugins/serverless-esbuild
```

그리고 `serverless.yml` 파일에 plugin을 추가하면 된다.

```yaml 
# serverless.yml
plugins:
  - serverless-esbuild
```

주의할 점은 기존에 사용하고 있던 플러그인과 충돌할 수 있다는 점이다. 나의 경우 타입스크립트 빌드를 위해 사용하던 `serverless-plugin-typescript` 플러그인과 충돌한 것 같다. `serverless-esbuild`는 추가 플러그인 없이도 JS와 TS에 동작하기 때문에 기존에 사용하던 플러그인은 더이상 필요하지 않아졌다.

## 추가 옵션

Lambda는 aws sdk가 내장되어있기 때문에 추가로 모듈을 함께 패키징할 필요가 없다. 그래서 `aws-sdk` 모듈을 제외하고 패키징하는 serverless 패키징 옵션을 보통 추가하는데, `serverless-esbuild`는 자체적으로 `aws-sdk` 모듈을 제외시킨다고 한다. 하지만 v3 sdk의 경우 `@aws-sdk`를 사용하는데 이는 default 옵션에서는 패키징에서 제외되지 않는다고 한다.

추가로 제외시킬 모듈은 아래 위치에 입력하면 된다.

```yaml
custom:
  esbuild:
    exclude:
      - "@aws-sdk"
```

## 그 외 패키징 사이즈 줄이는 옵션들

```yaml
package:
  individually: true
```

`individually: true` 옵션으로 패키지 함수를 개별 구성할 수 있다.

## 결과

최대 5분까지 걸리던 빌드 및 배포 시간을 대폭 축소 시켰다! 패키징 사이즈도 굉장히 줄어들었다. 기존에는 전체 파일이 83MB 정도로 동일했는데, 아래와 같이 줄었다.

![패키징 결과 이미지](../../../../../assets/posts/serverless-esbuild/202411121606.png) 

56초.. 말도 안된다. 이제 단일 function 업데이트는 2초 이내로 가능하다. 진작 적용할걸 그랬다.
