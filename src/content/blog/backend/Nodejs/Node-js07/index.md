---
title: "[Node.js] Express.js"
description: 'Express.js Express란? Node.js로 개발을 할 때 가장 많이 사용되는 웹 프레임워크이다. 2020 Node.js popular web framework statistics 웹 프레임워크 란 웹 서비스를 개발하기 위해 사용되는, 그 이름 그대로 틀 이다. 프레임워크 없이도 개발을 할 수는 있지만 프레임워…'
pubDate: 2020-08-30 23:40:29
tags:
  - Node.js
  - Javascript
category: Node.js

---


# Express.js

## Express란?

Node.js로 개발을 할 때 가장 많이 사용되는 웹 프레임워크이다.
[2020 Node.js popular web framework statistics](https://codersera.com/blog/top-10-nodejs-frameworks-for-developers-in-2020/)
**웹 프레임워크**란 웹 서비스를 개발하기 위해 사용되는, 그 이름 그대로 **틀**이다. 프레임워크 없이도 개발을 할 수는 있지만 프레임워크는 많은 기능이 제공되기 때문에 개발자는 직접적인 서비스 구현에 더 집중할 수 있다.

Express는 session 관리나 middleware 관리 등에서 편리한 환경을 제공한다. 미들웨어와 라우터를 사용하면 각각의 기능을 편리하게 구성할 수 있다.

웹 프레임워크에 Express만 있는 것은 아니다. 하지만 Node.js 커뮤니티는 계속해서 커지고 있으며 Express는 그런 Node.js 프로젝트에서 가장 많이 사용되는 프레임워크이다. 자연히 커뮤니티에서 여러 오류 해결법을 찾아볼 수 있어 레퍼런스가 풍부하다고 볼 수 있다!

구조가 이미 정해져있기 때문에 제약이 있다고 할 수도 있다. 하지만 정말 저명한 프레임워크이기 때문에 알아둬서 나쁠게 없다.

## without Express

```js
const http = require("http");
http
  .createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hello Server");
    response.end();
  })
  .listen(3000);
```

Express를 사용하지 않을 경우, response를 직접 작성해야 한다.

## with Express

Express 모듈을 설치 후 사용할 수 있다.

```bash
$npm i express
```

기본적으로 Express로 서버를 열 때 사용하는 코드이다.

```js
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log("Express listening on port", port);
});
```

- `app.get(url, callback)` : Client로 부터 get 요청을 처리함.
- `app.listen(port, callback)` : 지정된 포트에서 서버를 시작함.

## nodemon

이전에 정리한 `PM2` 처럼 서버에 오류 또는 파일 수정이 발생하면 자동으로 서버를 껐다 켜주는 모듈이다. `PM2`는 개인 프로젝트 개발용으로 쓰기에는 조금 무겁고 `nodemon`이 좀 더 가볍고 디버깅 하기 편리하다고 한다.

```
$ npm i nodemon -g
```

_`g` 키워드를 사용하면 해당 프로젝트 외부에서도 사용할 수 있도록 모듈을 전역 범위로 설치하게 된다._

`package.json` 파일에 스크립트를 저장해두면 간단한 명령어(`npm start`)로 서버를 시작할 수 있다.

```
"scripts": {
    ...
    "start": "nodemon app.js"
}
```

_`start`외에 다른 이름의 script를 추가했을 경우 이를 실행하기 위해서는 `npm run 명령어`로 실행해야 한다_

또한 프로젝트 협업자가 `nodemon`이 설치되어있지 않은 경우 `start` 명령에 오류가 발생하게되는데, 이때는 명령어 앞에 `npx`를 붙여주면 존재하지 않는 `nodemon`모듈을 자동으로 설치하고 실행하여 오류가 발생하지 않는다.
