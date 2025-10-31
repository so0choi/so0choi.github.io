---
title: AWS SAM (Lambda Typescript로 작성하기)
description: 'SAM은 Serverless Application Model의 줄임말이다. 서버리스 애플리케이션을 빌드하는 데 사용할 수 있는 오픈 소스 프레임워크이다. 서버리스 애플리케이션이란 작업을 수행하는 데 함께 작동하는 Lambda 함수, 이벤트 소스 및 기타 리소스의 조합이다. 단순 Lambda 함수 그 이상으로, API,…'
heroImage: '../../../../../assets/posts/AWS-SAM/2022-03-22-10-54-45.png'
pubDate: 2022-03-18 14:08:31
tags: SAM


---



SAM은 Serverless Application Model의 줄임말이다. 서버리스 애플리케이션을 빌드하는 데 사용할 수 있는 오픈 소스 프레임워크이다. 서버리스 애플리케이션이란 작업을 수행하는 데 함께 작동하는 Lambda 함수, 이벤트 소스 및 기타 리소스의 조합이다. 단순 Lambda 함수 그 이상으로, API, 데이터베이스, 이벤트 매핑 등의 추가 리소스를 포함할 수 있다.

AWS SAM CLI를 사용해 정의된 서버리스 응용 프로그램을 빌드한다. 로컬에서 Lambda 함수를 호출하고, 단계별로 디버깅하고, 서버리스 애플리케이션을 패키징하는 등의 작업이 가능하다. CodeBuild, CodeDeploy 및 CodePipeline 등의 서비스를 심층적으로 통합하여 사용할 수 있다.

## 설치

설치는 mac에서 homebrew로 진행했다.

```
brew tap aws/tap
brew install aws-sam-cli
```

시간이 좀 걸린다.

```
sam --version
```

명령어로 설치를 확인할 수 있다.

## 사용

### 생성

```
sam init
```

![](../../../../../assets/posts/AWS-SAM/2022-03-22-10-54-45.png)

- AWS Quick Start Templates
- Standalone function
- nodejs14.x

이름을 입력하면 파일과 폴더가 생성된다.

### 구조

![](../../../../../assets/posts/AWS-SAM/2022-03-22-11-01-18.png)

생성된 폴더는 위와 같이 구성되어있다.

- template.yaml : 애프릴케이션의 AWS resource를 정의하는 template
- src : Lambda 함수 코드
- **tests** : 유닛 테스트 코드

### Typescript 적용

TS를 적용했다. src 폴더 내부에 `src-ts`, `built` 폴더를 새로 만들고 `tsconfig.josn` 파일을 작성한다.

```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2017",
    "noImplicitAny": true,
    "preserveConstEnums": true,
    "outDir": "./src/built",
    "sourceMap": true
  },
  "include": ["src/src-ts/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

package.json에 컴파일용 스크립트도 추가한다.

```json

  "scripts": {
    "compile": "tsc"
  },
```

#### src-ts/app.ts

```js
exports.handler = async (): Promise<string> => {
  const message = "Hello from Lambda!";
  console.info(`${message}`);

  return message;
};
```

#### src/app.js

```js
exports.handler = async () => {
  const message = "Hello from Lambda!";
  console.info(`${message}`);
  return message;
};
//# sourceMappingURL=app.js.map
```

### 배포

이제 `template.yaml`을 수정한다.

```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: >-
  mbus-vod-stream

Transform:
  - AWS::Serverless-2016-10-31

Resources:
  samLambdaTest:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: test-sam
      CodeUri: src/built
      Handler: app.handler
      Runtime: nodejs14.x
      Architectures:
        - x86_64
      MemorySize: 128
      Timeout: 100
      Description: midibus vod stream function
      Policies:
        - AWSLambdaBasicExecutionRole
```

대부분 생성된 템플릿을 그대로 사용한다. `FunctionName`은 필수는 아니지만 정의되지 않으면 랜덤한 이름으로 Lambda가 생성된다.

sam은 CloudFormation으로 코드를 배포한다. 다음은 sam cli를 사용해 배포하는 방법이다.

```
sam deploy --guided
```

sam은 s3 또는 Amazon ECR에 코드를 업로드하고 그 후 애플리케이션이 AWS Cloud에 배포된다.
guided 플래그 사용시 CloudFormation에 stack을 하나 새로 생성하는데 한 번 생성한 후 이 스택을 계속 사용하고 싶다면 guided 플래그를 사용하지않고 사용할 stack 이름을 명시해주면 된다.

```
sam deploy \
--stack-name test-lambda \
--s3-bucket test-bucket \
--capabilities CAPABILITY_IAM
```

stack 템플릿에 IAM 리소스가 포함되어 있는 경우 `--capabilities CAPABILITY_IAM` 을 지정하지 않으면 오류가 발생한다.

명령어가 길고 일일이 치기 번거롭다. 그래서 CodePipeline을 붙여 CI/CD를 적용한 방식을 많이 사용한다.

## 참고

- [AWS Serverless Application Model](https://docs.aws.amazon.com/ko_kr/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [How to use typescript for aws lambda in 3 steps](https://levelup.gitconnected.com/how-to-use-typescript-for-aws-lambda-in-3-steps-1996243547eb)
- [AWS CloudFormation](https://docs.aws.amazon.com/ko_kr/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-action-reference.html)
