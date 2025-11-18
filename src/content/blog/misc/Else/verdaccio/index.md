---
title: verdaccio private npm registry 구축하기
description: '내부에서 사용하기 위한 npm 라이브러리를 만들게되었다. 테스트를 위해 private npm에 배포하려고 보니 유료 서비스였다. 무료로 해결할 방법을 찾다가 verdaccio를 발견해서 사용해봤는데 사용법이 매우 간편해서 정리해두려한다. registry란 package의 레포지토리이다. yarn, npm, pnpm을 지…'
pubDate: 2025-04-02 15:05:52
category: misc




---


내부에서 사용하기 위한 npm 라이브러리를 만들게되었다. 테스트를 위해 private npm에 배포하려고 보니 유료 서비스였다. 무료로 해결할 방법을 찾다가 verdaccio를 발견해서 사용해봤는데 사용법이 매우 간편해서 정리해두려한다.

registry란 package의 레포지토리이다. yarn, npm, pnpm을 지원한다. 다양한 오픈소스 프로젝트에서 verdaccio를 사용한다. Storybook, pnpm, gatsby, Apollo GraphQL 등 다양하게 사용되고 있다.

## 설치

```shell
npm install -g verdaccio
yarn global add verdaccio
```

`Verdaccio`는 꼭 global로 설치되어야한다.

도커 이미지도 제공하고 있다.

```shell
docker pull verdaccio/verdaccio:nightly-master
```

## 사용법

사실 설치만 하면 사용할 준비는 모두 끝났다고 볼 수 있다.

```shell
$ verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/5.0.0
```

verdaccio를 실행하면 default 설정으로 localhost의 4873 포트에 registry 서버가 생성된다.

### publish

간단하게 커맨드 입력으로 verdaccio registry에 모듈을 publish할 수 있다.
```shell
npm publish --registry http://localhost:4873
```

또는 package.json 파일에 설정을 저장할 수도 있다.

```json
{
  "publishConfig": {
    "registry": "http://localhost:4873"
  }
}
```

처음 publish 명령어를 실행하면 사용자를 등록하는 프롬프트가 출력된다. 사용자명과 이메일, 패스워드 정보를 입력하면 바로 publish가 실행된다.

### install

설치 또한 간단하다.

```shell
npm install --registry http://localhost:4873
```

`--registry` 옵션으로 registry 서버를 기본 Npm 서버에서 변경하여 설정한 레지스트리에서 라이브러리를 다운로드 할 수 있다. 기본 레지스트리 세팅을 설정하는 방법은 아래와 같다.

```shell
npm set registry http://localhost:4873/
```

특정 프로젝트에 한해서만 레지스트리를 변경하고 싶다면 `--location` 옵션을 추가하면 된다.

```shell
npm set registry http://localhost:4873/ --location project
```

이 명령어를 실행하면 프로젝트 폴더에 `.npmrc` 파일이 생길 것이다.

## user 관리

처음 verdaccio 서버를 생성하면 유저를 만들고 로그인을 해야한다.

```shell
npm adduser --registry http://localhost:4873/
npm login --registry http://localhost:4873/
```

로그인을 완료하면 publish, download를 할 수 있게 된다.

npm, yarn, pnpm 등 메이저 패키지 매니저는 모두 사용 가능하다. yarn과 pnpm의 사용법도 크게 다를 바 없지만 정확한 사용법은 공식 문서를 참조하면 알 수 있다.
