---
title: OAuth2.0 이란
description: 'OAuth(Open Authorization)는 클라이언트 디벨로퍼가 다양한 환경에서 개발할 때 더 간단한 인증 플로우를 가질 수 있도록 고안된 개념으로 인증 프레임워크이다. 데스크탑 애플리케이션, 모바일 애플리케이션, 각종 가정용 디바이스 등 클라이언트 환경이 다양해졌기 때문에 공통의 인증 서버를 두게 되면 훨씬 간편…'
heroImage: './OAuth2-0.png'
pubDate: 2023-09-25 09:08:59
category: misc



---



OAuth(Open Authorization)는 클라이언트 디벨로퍼가 다양한 환경에서 개발할 때 더 간단한 인증 플로우를 가질 수 있도록 고안된 개념으로 인증 프레임워크이다. 데스크탑 애플리케이션, 모바일 애플리케이션, 각종 가정용 디바이스 등 클라이언트 환경이 다양해졌기 때문에 공통의 인증 서버를 두게 되면 훨씬 간편해진다. 

## 개념
OAuth는 제 3의 애플리케이션이 제한된 권한으로 접근 가능한 HTTP 서비스에 대해 리소스의 주인 또는 그를 대신하여 인가를 관장하는 인증 프레임워크이다.
타 웹 서비스에서 구글이나 페이스북 계정을 사용해 계정을 생성하고 그 계정으로 서비스를 이용할 수 있는 것이 OAuth 라고 볼 수 있다.
사용자 정보의 인증을 내 서비스가 아닌 타 서비스에 위임하는 것이다.

OAuth 1.0은 consumer, service provider, user로 구성되는데, 여기서는 리소스 서버와 인증 서버의 롤이 정확히 구분되어 있지 않다. OAuth 2.0은 client, authorization server, resource server, resource owner로 구성되며 각 구성원들의 롤이 정확히 구분되어있다. 그렇기 때문에 1.0과 2.0은 서로 호환될 수 없다. 

![](./OAuth2-0.png)

## 주요 용어

|구분| 설명                                                  |
|--|-----------------------------------------------------|
|Resource Owner | 웹 서비스를 사용하려는 유저                                     |
|Client| 개인이 만든 애플리케이션 서버, Resource server에게 필요한 자원을 요청하는 서버 |
| Authorization Server|권한을 부여해주는 서버|
|Resource Server|리소스를 가지고 있는 서버 (Google, Facebook, Kakao 등)
|Access Token|자원에 대한 접근 권한을 Resource Owner가 인가하였음을 나타내는 자격증명|
|Refresh Token|Access Token은 비교적 짧은 만료기간을 가지며 Refresh Token으로 재로그인 없이 서비스를 이용할 수 있게끔 함|

Access Token이 있어야 리소스를 요청 할 수 있고 Access Token은 비교적 짧은 만료기간을 가지며 이를 갱신하는 데 사용하는 것이 Refresh Token인 것이다. Refresh Token을 사용함으로써 사용자가 재로그인 해야 하는 번거로움을 조금이나마 줄여줄 수 있다.

### Access Token

OAuth client가 리소스 서버로 요청을 보낼 때 사용되는 토큰이다. 하나의 정해진 포맷이 있는 것이 아니며 다양한 모양으로 사용할 수 있다. 예를 들면 'bearer token'이 있다.
다만 몇 가지 제약 사항이 있는데,

- Access Token은 OAuth client에 의해서 해석되어서는 안된다.
- Access Token으로 user에 대한 정보를 OAuth client가 알게되어서는 안된다.
- Access Token은 리소스 서버로 요청을 보낼 때만 사용되어야 한다.


## 참고 
- [OAuth 2.0](https://oauth.net/2/)
- [OAuth 2.0 개념 - 그림으로 이해하기 쉽게 설명](https://inpa.tistory.com/entry/WEB-%F0%9F%93%9A-OAuth-20-%EA%B0%9C%EB%85%90-%F0%9F%92%AF-%EC%A0%95%EB%A6%AC)
- [What is OAuth (The Modern Guide)](https://fusionauth.io/articles/oauth/modern-guide-to-oauth)
- [What is OAuth? A Complete Explanation](https://www.upguard.com/blog/oauth)
