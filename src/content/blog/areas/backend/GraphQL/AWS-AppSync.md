---
title: AWS AppSync & AWS Amplify
description: 'AWS AppSync AWS AppSync는 AWS의 Managed GraphQL 및 Pub/Sub API 서비스이다. 서버리스 WebSocket을 통해 이벤트 소스의 데이터를 구독해 실시간 환경을 만들 수 있다. 단일 엔드포인트를 통해 애플리케이션 개발을 간소화하는 서버리스 GraphQL 및 게시/구독 API를 생성하…'
heroImage: '../../../../../assets/posts/AWS-AppSync/AWS-AppSync.png'
pubDate: 2024-01-11 16:43:48
tags: GraphQL
category: AWS


---



## AWS AppSync

AWS AppSync는 AWS의 Managed GraphQL 및 Pub/Sub API 서비스이다. 서버리스 WebSocket을 통해 이벤트 소스의 데이터를 구독해 실시간 환경을 만들 수 있다.
단일 엔드포인트를 통해 애플리케이션 개발을 간소화하는 서버리스 GraphQL 및 게시/구독 API를 생성하여 데이터를 안전하게 쿼리, 업데이트 또는 게시한다.

실시간으로 데이터를 업데이트해 항상 최신의 데이터를 보여주는 모니터링 대시보드를 만들게되어 AppSync를 활용해보기로 했다.

![AppSync](../../../../../assets/posts/AWS-AppSync/AWS-AppSync.png)

### 특징

- GraphQL로 구동되는 간소화된 데이터 액세스 및 쿼리
- GraphQL 구독 및 게시 / 구독 채널을 위한 서버리스 Websocket
- Javascript 및 Typescript 지원
- 내장된 보안, 모니터링, 로깅 및 추적을 활용하고 지연 시간을 줄이기 위한 선택적 캐싱을 활용 (캐싱은 추가 요금 부과)
- 여러 소스 GraphQL API를 하나의 병합된 GraphQL API로 결합

### AWS Amplify

AWS에서 풀 스택 웹 및 모바일 앱을 구축하는 데 필요한 모든 것을 제공하는 AWS 서비스이다. 프론트엔드를 구축 및 호스팅하고, 인증 및 스토리지와 같은 기능을 추가하고, 실시간 데이터 소스에 연결하고, 배포 및 확장이 가능하다. Amplify Hosting과 Amplify Studio 두 가지 서비스를 제공한다.

#### 특징

- CI/CD 자동 관리
- 200개 이상의 AWS 서비스에 액세스 가능
- 서버리스로 사용량에 따른 요금으로 제공

### Amplify Hosting

- git 기반의 워크플로우를 가지고 풀 스택 서버리스 웹 앱을 호스팅해주며 CD(Continuous Depolyment)를 지원한다.
- 일반적인 SPA 프레임워크를 지원한다. (React, Angular, Vue.js, Ionic, Ember) 정적 사이트를 생성해주는 라이브러리도 지원한다. (Gatsby, Eleventy, Hugo, VuePress, Jekyll)
- 커스텀 도메인을 연결해준다.
- SSR 웹 앱을 배포하고 호스팅 해준다. Next.js 프레임워크를 사용해 애플리케이션이 생성된 것을 자동 감지한다.
  - Next.js 외에도 Amplify는 Amplify Hosting이 감지할 수 있는 build 출력 디렉토리 구조로 변형시켜주는 오픈소스 빌드 어댑터를 가진 자바스크립트 기반의 SSR 프레임워크를 지원한다. Nuxt 애플리케이션을 Amplify에 배포하는 것도 가능하다.
- pull request 프리뷰를 세팅하면 코드 리뷰의 변화를 볼 수 있다.

### Amplify Studio

AWS 콘솔에서 사용할 수 있다. 풀스택 웹 & 모바일 앱 개발을 도와주는 시각화 개발 환경이다. ready-to-use UI 컴포넌트 세트로 프론트엔드 UI를 구성할 수 있고 백엔드를 구성하여 두 개를 서로 연결할 수 있다.

- 쉽고 간단하게 인증을 구현할 수 있다.
- Infrastructure-as-code 설정으로 모든 백엔드 설정을 AWS CloudFormation으로 구성한다.
- 비주얼 데이터 모델링으로 사용자가 클라우드 인프라 구조 보다는 도메인에 집중할 수 있게 해준다.
- Amplify Command Line Interface (CLI)를 제공한다. 콘솔에서 발생하는 작업들은 CLI로도 요청할 수 있다.
- 이메일을 통해 다른 유저를 초대해 백엔드 관리를 맡길 수 있다.
