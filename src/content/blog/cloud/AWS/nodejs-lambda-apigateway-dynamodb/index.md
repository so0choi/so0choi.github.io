---
title: Node.js + Lambda + APIGateway + DynamoDB
description: 'Lambda 람다는 서버리스 코드 실행 컴퓨팅 서비스이다. 항상 가동되는 것이 아니라 필요 시에만 코드를 실행하기 때문에 경제적이다. 또한 사용자는 컴퓨터 자원에 대해서는 고려하지 않아도 되며 오로지 코드에만 책임을 가지기 때문에 상황에 따라 아주 효율적으로 사용될 수 있다. 람다는 다양한 언어로 사용할 수 있다. No…'
heroImage: './2020-11-13-11-52-08.png'
category: AWS
pubDate: 2020-11-17 22:27:37
tags:
  - AWS
  - Node.js
  - Lambda
  - API Gateway
  - DynamoDB


---



## Lambda

람다는 서버리스 코드 실행 컴퓨팅 서비스이다. 항상 가동되는 것이 아니라 필요 시에만 코드를 실행하기 때문에 경제적이다. 또한 사용자는 컴퓨터 자원에 대해서는 고려하지 않아도 되며 오로지 코드에만 책임을 가지기 때문에 상황에 따라 아주 효율적으로 사용될 수 있다.

람다는 다양한 언어로 사용할 수 있다. Node.js, Python, Java, Go 등 대부분의 언어를 지원하고 있다. 그 중 Node.js로 작성하는 방법을 알아봤다.

### 핸들러

```js
exports.handler = async function (event, context, callback) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  return context.logStreamName;
};
```

- event : 호출자로부터의 정보가 포함된 객체. JSON 형식 문자열로 전달하고, 런타임은 이를 객체로 변환한다.
- context : 호출, 함수 및 실행 환경에 대한 정보가 포함되어 있다.
- callback : 응답을 전송하기 위해 비동기 이외의 핸들러에서 호출할 수 있는 함수. callback 함수는 에러 또는 응답을 반환하며 callback 호출시 람다는 이벤트 루프가 비워질 때 까지 기다린 후에 callback 결과값을 호출자에 반환한다. -> 비동기 핸들러의 경우 Promise 반환

AWS 람다 콘솔에서 테스트를 할 수 있다. event로 값을 넘겨서 출력하고 싶은 경우 다음처럼 사용하면 된다.

### 테스트 이벤트 구성

```js
{ "name" : "sy" }
```

index.js

```js
exports.handler = async (event, context, callback) => {
  let result = { event: event, context: context };
  let name = event.name || "no name";
  context.succeed(`Hello ${name}`);
};
```

### 결과

```
Response:
"Hello sy"
```

## DynamoDB

DynamoDB는 종합 관리형 NoSQL DB(비관계형 데이터베이스) 서비스이다. 확장성이 좋고 분산 DB를 운영하고 조정하는 데 따른 관리 부담을 줄일 수 있다. DynamoDB에는 저장용량이 제한되어있지 않다. 웹 서비스이며 application은 지속적인 네트워크 연결을 유지할 필요가 없다. 그 대신 모든 상호 작용은 HTTP(S) 요청 및 응답을 사용하여 이루어진다.

![](./2020-11-13-11-52-08.png)

### 구성 요소

- table : 다른 db 시스템과 같이 정보를 저장하는 data의 집합이다.
- item : 각 테이블을 구성하는 data를 말한다.
- attribute : 각 item을 구성하는 data를 말한다. 더이상 쪼개지지 않는 가장 작은 단위이다.

![](./2020-11-13-11-46-23.png)

- Primary Key : 테이블을 생성할 때 테이블의 기본 키를 지정해야 한다. 테이블 기본 키는 테이블의 각 항모을 나타내는 고유 식별자이다. 다른 DB 시스템에 있는 개념과 같다.

## API Gateway

API Gateway는 규모와 관계없이 REST 및 WebSocket API를 관리하기 위한 AWS 서비스이다. AWS 또는 다른 웹 서비스가 AWS 클라우드에 저장된 데이터에 액세스하는 API를 생성할 수 있다. AWS API Gateway는 RESTful API를 생성한다.

![](./2020-11-16-10-27-30.png)
[TOAST API GATEWAY 설명](https://meetup.toast.com/posts/201)

## 연동 시작

### Gateway 구현

처음 Gateway 생성화면을 띄우면 API의 종류를 선택하는 창이 나온다. 나는 REST API를 구축하기로 했다. API GATEWAY를 처음 사용한다면 생성시 선택할 수 있는 템플릿을 사용해 API를 생성해보고 구조를 살펴보는 것도 좋은 것 같다.

기본 설정 후 작업 화면으로 오면 root 리소스 하나만 생성되어있다. 리소스를 생성하고 `작업` > `리소스 생성` 작업으로 하위 uri를 만들어 사용할 수 있다. 이후 API 배포를 할 때 현재 배포 단위의 stage를 새로 생성하거나 정하여 배포하는데, 그렇게 만든 API의 접근 주소는 - `API Gateway 주소/stage 이름/리소스 이름` 이 된다.

리소스를 만들면 그 안에 사용할 HTTP Method를 생성하여 작업을 지정할 수 있다. 나는 DynamoDB에 연결해야 하기 때문에 리소스를 만들고 `POST` 메서드를 생성해 Lambda와의 연동을 선택했다.

### DynamoDB 테이블 생성

테이블 생성은 어렵지 않다. DynamoDB 서비스 콘솔창으로 이동하면 테이블을 생성 할 수 있다. 각 아이템을 구분할 키 하나만 생성하면 간단하게 만들어진다.

### Lambda 함수 작성

Lambda는 생성하면서 DynamoDB와 연동이 되어있는 `blueprint를 생성하기` 를 선택했다. 그렇게 하면 trigger가 자동으로 연결되어 생성된다. DB 테이블은 좀 전에 생성한 DynammoDB 테이블을 선택해주면 된다. 다시 API Gateway로 가서 생성한 Lambda 함수의 이름을 입력하면 연결된다.

API Gateway는 생성 후 꼭 **배포**를 해야 한다. stage는 필수요소이기 대문에 처음 배포를 누르면 stage를 만들어야 한다. test, dev.. 등 아무거나 입력해도 좋다. 이후에도 설정에 변화를 주었다면 배포를 새로 해야하므로 항상 잊지 않도록 해야한다.

### Express앱과 연결

Node.js의 `request-promise` 모듈을 사용했다.

> 찾아보니 더이상의 업데이트가 없는 deprecated library였다. 이유는 변화하는 javascript ecosystem에서 해당 라이브러리는 out-datd 되었다는 것. 하지만 앱에서 기존에 계속 사용되던 라이브러리였고 보안상의 이슈와 같은 큰 이슈는 없는것으로 보아 그냥 사용하기로 했다.

request-promise의 요청 url로 해당 API Gateway url 을 생성한 Gateway 주소로 기입해준다.

## 오류

![](./2020-11-16-16-28-45.png)

### 해결법

JSON은 부조건 쌍따옴표를 키와 값에 써야 한다.
[AWS Lambda를 이용해서 HTTP API 만들기 #2](https://blog.outsider.ne.kr/1206)

## 참고

[AWS Lambda와 API Gateway를 이용해서 Serverless Web API 만들기](https://devstarsj.github.io/cloud/2016/11/21/Lambda+APIGateWay.01/)
