---
title: "[Node.js] Node.js의 기본 기능"
description: '노드는 주로 서버 쪽 기능을 담당하는 자바스크립트 기반의 프로그래밍 언어이다. 이벤트 기반으로 동작하는 언어이므로 이벤트를 어떻게 처리하는지 잘 알아둬야 한다. 다른 서버 언어들과의 차이점 세상이 Node.js에 열광한 이유를 찾아보려면 Node.js가 나온 이유에 대해 알아야 한다. 간단히 말하면 HTML을 일일이 고…'
pubDate: 2020-08-16 22:18:48
tags: Node.js
category: Node.js

---


노드는 주로 서버 쪽 기능을 담당하는 자바스크립트 기반의 프로그래밍 언어이다.
이벤트 기반으로 동작하는 언어이므로 이벤트를 어떻게 처리하는지 잘 알아둬야 한다.

### 다른 서버 언어들과의 차이점

세상이 Node.js에 열광한 이유를 찾아보려면 Node.js가 나온 이유에 대해 알아야 한다. 간단히 말하면 HTML을 일일이 고치고 하드코딩하는 작업이 싫었던 개발자들이 작업을 수월하게 하기 위해 친근한 언어인 Javascript를 기반으로 하는 서버 언어를 만든 것이다.
Node.js를 사용하면 Apache 에서는 할 수 없는 사용자에게 전송하는 데이터를 **능동적**으로 생성할 수 있고 이것이 Node.js가 가지고 있는 힘이다.:star2:

### 주소 문자열 다루기

- url 객체
  웹 사이트에 접속하기 위한 사이트 주소 정보를 다룰 수 있는 객체
  주소 문자열을 입력하면 *protocol, host, query ... *등 접속을 다루기 위해 필요한 정보들로 문자열을 구분해 객체에 저장한다.

- url 형식

주요 메서드

- `parse()` : 주소 문자열을 파싱하여 URL 객체를 만들어 준다.
- `format()` : URL 객체를 주소 문자열로 변환한다.

```js
var url = require("url");
var curURL = url.parse("https://en.wikipedia.org/wiki/Steve_Jobs");
var curStr = url.format(curURL);
console.log("주소 문자열 : %s", curStr);
console.log(curURL);
```

`url` module로 url 객체를 사용할 수 있다. 실행 결과는 아래와 같다.

```
주소 문자열 : https://en.wikipedia.org/wiki/Steve_Jobs
Url {
  protocol: 'https:',
  slashes: true,
  auth: null,
  host: 'en.wikipedia.org',
  port: null,
  hostname: 'en.wikipedia.org',
  hash: null,
  search: null,
  query: null,
  pathname: '/wiki/Steve_Jobs',
  path: '/wiki/Steve_Jobs',
  href: 'https://en.wikipedia.org/wiki/Steve_Jobs'
}
```

### 요청 파라미터, query string

위 실행 결과의 Url 객체의 속성 중 `query`는 요청 파라미터 정보를 가지고 있다. 웹 서버는 클라이언트가 요청한 요청 파라미터를 처리해야 하는 경우가 많기 때문에 (주소 뒤 '?' 뒤에 오는 속성들이다) 이 `query`속의 문자열을 다시 각각의 요청 파라미터로 분리해야 한다.
요청 파라미터는 `&`기호로 구분된다. 이 때 `querystring` 모듈을 사용하면 쉽게 작업할 수 있다.

Node.js는 사용자의 입력에 따라 서비스를 제공하기 위해 만들어진 언어이므로 query string은 매우 빈번하고 중요하게 다뤄진다.

주요 메서드

- `parse()` : 요청 파라미터 문자열을 파싱하여 요청 파라미터 객체로 만들어준다.
- `stringify()` : 요청 파라미터 객체를 문자열로 변환한다.

## 웹 서버 만들기

노드의 http 모듈을 사용해 웹 서버 기능을 담당하는 서버 객체를 만들 수 있다. http 모듈에는 `createServer()` 메소드가 정의되어 있다. 이 메소드를 호출하여 서버 객체를 만들 수 있다.

간단한 서버 만드는 예제 소스 코드

```js
var http = require("http");
var fs = require("fs");
var app = http.createServer(function (request, response) {
  var url = request.url;
  if (request.url == "/") {
    url = "/index.html";
  }
  if (request.url == "/favicon.ico") {
    return response.writeHead(404);
  }
  response.writeHead(200);
  response.end(fs.readFileSync(__dirname + url));
});
app.listen(3000);
```
