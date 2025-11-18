---
title: Github OAuth 로그인
description: 'Github OAuth 로그인 깃허브에서 제공하는 API를 사용하면 쉽게 유저 정보를 불러와 사용할 수 있다. 위 공식문서를 참조하면 간단하게 구현할 수 있지만 한 번 정리만 해놓으려고 한다. Github OAuth Application 생성 Github 계정 설정 Developer settings OAuth Apps…'
pubDate: 2022-02-06 13:03:56
tags:
  - Web
  - Github OAuth
category: frontend









---







깃허브에서 제공하는 API를 사용하면 쉽게 유저 정보를 불러와 사용할 수 있다.

> [공식 문서 : Authorizing OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)

위 공식문서를 참조하면 간단하게 구현할 수 있지만 한 번 정리만 해놓으려고 한다.

## Github OAuth Application 생성

Github 계정 설정 > Developer settings > OAuth Apps
메뉴로 들어오면 새로운 OAuth Apps을 생성할 수 있다.  

**callback url**은 나중에 써야하니 기억해놓자.

생성을 마치면 앱 설정 화면으로 넘어오는데, 여기서 API에 필요한 파라미터들(client_id, secret 등)을 발급받을 수 있다.

## 사용자의 Github 계정 정보 요청하기

```
GET https://github.com/login/oauth/authorize
```

### 파라미터

| Name         | Description                                                                                                                                                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| client_id    | **Required** Github OAuth 앱 생성시 부여받은 값                                                                                                                                                                                                          |
| allow_signup | Github 계정을 원래 가지고 있는 사용자만 이 방법으로 로그인을 요청할 수 있게 할 지를 결정할 수 있다. default는 true로, 계정이 없는 경우 Sign up하라는 버튼을 포함한 페이지가 출력된다.                                                                    |
| scope        | 입력하지 않을 경우 public 정보만을 요청한다. 더 많은 정보가 필요할 경우 공백으로 구분한 값을 요청할 수 있다. [scopes](https://docs.github.com/en/apps/building-oauth-apps/understanding-scopes-for-oauth-apps)에서 가능한 scope 리스트를 확인할 수 있다. |

이 외 파라미터들은 문서를 참조해 필요에따라 사용하면 되겠다.
위 URL로 이동된 사용자가 정상적으로 Github에 로그인하여 정보 제공에 동의하면 이전에 지정한 callback URL로 **code** 파라미터가 넘어온다.

## Github에 Access token 요청하기

Github에서 받은 code는 10분간 유효하다. 아래 URL로 유저 정보를 요청할 수 있다.

```
POST https://github.com/login/oauth/access_token
```

| Name          | Description                                     |
| ------------- | ----------------------------------------------- |
| client_id     | **Required** Github OAuth 앱 생성시 부여받은 값 |
| client_secret | **Required** Github OAuth 앱 생성시 부여받은 값 |
| code          | **Required** callback URL로 부터 받은 값        |

응답 포맷은 헤더에 명시한다. 예를 들어 json으로 받고 싶은 경우 아래와 같이 설정한다.

```
Accept: application/json
```

만료되지 않은 code로 정상 요청이 이루어지면 Access token을 받을 수 있다.
응답은 아래와 같다.

```json
{
  "access_token": "gho_16C7e42F292c6912E7710c838347Ae178B4a",
  "scope": "repo,gist",
  "token_type": "bearer"
}
```

## Access token 이용해 유저 정보 요청하기

전달받은 Access token으로 유저 정보를 요청한다.

```
Authorization: token OAUTH-TOKEN
GET https://api.github.com/user
```

Header.Authorization에 **OAUTH-TOKEN**에 Access token을 넣어 요청해 마침내 유저 정보를 받을 수 있다!

## Private Info

이렇게 해도 private한 정보, 예를 들어 유저의 email등은 `null`값으로 받아온다. private 정보를 받기 위해서는 추가 요청이 필요하다. 예를 들어 유저의 Github 계정에 저장된 모든 email 정보는 `/user/emails/`로 요청하여 받아올 수 있다. 물론 모든 정보를 받아 올 수 있는게 아니라, 위에서 토큰 발급을 위해 사용했던 **scope**에서 정의한 정보에 대해서만 해당 토큰을 이용한 요청으로 정보를 받아올 수 있다.
