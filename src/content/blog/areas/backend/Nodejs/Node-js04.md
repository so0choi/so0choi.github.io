---
title: "[Node.js] 패키지 매니저와 PM2"
description: '패키지 매니저와 PM2 Node.js를 사용하다보면 다양한 모듈을 설치해 외부 기능을 사용해야 할 때가 많다. 다양한 패키지 매니저가 있는데 나는 을 주로 사용한다. npm npm을 사용하기 위해서는 패키지 정보를 기록하는 파일이 필요하다. 명령어를 입력하면 자동으로 이 만들어진다. npm으로 다른 사람이 만든 모듈을…'
pubDate: 2020-08-19 13:28:26
tags:
  - Node.js
  - Javascript
category: Node.js

---


## 패키지 매니저와 PM2

Node.js를 사용하다보면 다양한 모듈을 설치해 외부 기능을 사용해야 할 때가 많다. 다양한 패키지 매니저가 있는데 나는 `npm`을 주로 사용한다.

### npm

npm을 사용하기 위해서는 패키지 정보를 기록하는 `package.json`파일이 필요하다.

```
$ npm init
```

명령어를 입력하면 자동으로 `package.json`이 만들어진다.
npm으로 다른 사람이 만든 모듈을 다운받을 수 있다.

```
$ npm install express
$ npm i express
```

위의 두 명령어는 같은 동작을 한다. 다만 `install`을 `i`로 줄여 쓸 수도 있다. 설치하는 모듈들의 정보는 모두 `package.json`에 기록된다.

### package.json

`package.json` 파일이 있을 경우 `npm install` 명령어를 실행하면 `package.json`에 명시된 모든 패키지들을 자동으로 설치한다. 따라서 내가 설치한 모듈이 없는 다른 사용자에게 내 소스 코드를 보내도 `package.json`파일만 함께 전달한다면 어디에서나 코드를 실행 할 수 있다.

### package-lock.json

모듈의 충돌을 방지하기 위해 각 모듈들의 다른 모듈로의 의존성과 의존하는 모듈들의 버젼을 명시한다.

### PM2

PM2는 Node.js 프로그램을 더욱 강력하고 개발하기 쉽게 만들어주는 패키지이다. [PM2](https://pm2.keymetrics.io/) 공식 홈페이지에서 설치방법과 사용방법을 볼 수 있다.

다양한 기능을 제공하는데 그 중 사용하면 편의성을 높여주는 기능에는 Process가 죽었을 때 서버를 자동으로 새로 시작해주는 것이다.

```
$ pm2 start main.js
$ pm2 stop main.js
$ pm2 list
```

`start` 명령어로 시작할 수 있다. `list`로는 현재 pm2로 실행중인 프로세스들을 볼 수 있다.

```
$ pm2 monit
```

`monit` 명령어를 사용해 Dashboard를 볼 수 있다. 대쉬보드 창을 킨 상태로 실행중인 Node.js 프로세스를 강제 종료 후 창을 확인해보면 명령어 몇개가 새로 출력되어있고 실행중인 프로세스에 Node.js 프로세스가 다시 자동으로 실행되고 있는 것을 볼 수 있다.

```
$ pm2 start main.js --watch
```

`watch` 옵션을 추가하면 main.js 파일에 변화가 생길 때 마다 서버를 재가동시켜준다. 따라서 그동안 수동적으로 서버를 껐다 켰던 작업들이 필요없어지게 된 것이다. 창만 reload 해주면 코드 수정이 적용된다.
