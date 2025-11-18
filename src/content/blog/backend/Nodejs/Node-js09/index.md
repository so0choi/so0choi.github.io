---
title: "[Node.js] Nunjucks"
description: 'View Engine Nunjucks Node.js로 응답 페이지를 구성하는 방법은 여러가지가 있다. 그 중 하나는 아래 코드처럼 로 html을 하나씩 써주는것이다. 이렇게 한줄씩 쓸 수는 있지만 모든 작업을 이렇게 한다고 생각하면 정말 막막할 것이다. 이를 대신해서 쓸 수 있는 방법이, 데이터 처리 로직 부분 과 화면…'
heroImage: './2020-08-31-16-41-38.png'
pubDate: 2020-08-31 15:47:25
tags:
  - Node.js
category: backend






---



# View Engine - Nunjucks

Node.js로 응답 페이지를 구성하는 방법은 여러가지가 있다. 그 중 하나는 아래 코드처럼 `write()`로 html을 하나씩 써주는것이다.

```js
const http = require("http");
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
    res.write('<!DOCTYPE html>')
    res.write('<html>')
    res.write('<head><meta charset="UTF8"><title>title</title></head>');
    res.write('<body>');
    res.write("<h1>Hello Server</h1>");
    res.write("helllllo");
    res.write('</body>);
    res.write('</html>');
    res.end();
  })
  .listen(3000);
```

이렇게 한줄씩 쓸 수는 있지만 모든 작업을 이렇게 한다고 생각하면 정말 막막할 것이다. 이를 대신해서 쓸 수 있는 방법이, **데이터 처리 로직 부분**과 **화면에 보여주는 부분**을 분리하는 방법이다.
이런 방식을 **MVC 패턴**이라고 하는데, 다양한 프레임워크에서 통용되는 패턴이다.
[MVC 패턴 이전 블로그 정리글](https://studyeong.blogspot.com/2020/04/web-spring-mvc-model.html)
은 Java Spring Framework를 기반으로 한 정리글이지만 기본 아이디어는 같기 때문에 이해하는데 도움이 된다.

**View Engine**이 바로 Node.js에서 MVC 패턴을 가능하게 해주는 시스템이다. 뷰 엔진을 사용해 템플릿 문서에서 변수를 입력해 렌더링한 페이지를 출력하게 하도록 할 수 있다.

![](./2020-08-31-16-41-38.png)
[Express](https://expressjs.com/en/resources/template-engines.html) 사이트에서 Express가 지원하는 다양한 뷰엔진들을 확인할 수 있는데 이번에는 `Nunjucks`를 사용해 프로젝트를 진행한다.
(`EJS`의 경우 html 파일을 작성하는 것과 똑같이 작성하면서 변수가 필요한 부분에 간단한 문법을 적용시키면 되어 사용하기 편했다. 하지만 문법에 결함이 있기 때문에 사용을 지양하는게 좋다고 한다..)

## Nunjucks

Nunjucks는 `Mozila` 재단에서 개발한 자바스크립트 뷰엔진이다. 눈적스를 소개할 때는 항상 `rich`라는 수식어를 달고 다니는데 개발을 편리하게 해주는 기능이 많다고 한다.

### 사용방법

```
$npm i nunjucks
```

먼저 Numjucks 모듈을 npm으로 설치한다.

`app.js`에서 `nunjucks` 모듈을 불러와 템플릿 파일의 경로를 설정한다.

```js
const nunjucks = require("nunjucks");
nunjucks.configure("template folder name", {
  autoescape: true,
  express: express object name,
});
```

여기서 `autoescape`를 `true`로 지정한 이유는 XSS 공격을 방지하기 위해 `text`로 입력된 html 태그는 모두 무효화 하기 위해서 한 설정이다. `false`로 지정할 경우 게시글에 입력된 html 코드도 모두 동작하게 된다.

`response` 객체의 `render()` 메서드를 사용해 뷰 엔진을 적용할 수 있다.

```js
router.get("/products", (req, res) => {
  //   res.send("admin products");
  res.render("admin/products.html", {
    name: "soyeong",
    age: 100,
  });
});
```

`app.js`에서 지정한 템플릿 폴더 뒤의 경로만 적어주면 된다. 그리고 렌더링할 변수의 값들을 작성한다.

html 파일에는 다음과 같이 작성했다.

```
안녕하세요 이름은 {{name}}. 나이는 {{age}}살 입니다.
```

`{{}}` 연산자로 변수를 나타낸다.

![](./2020-08-31-17-19-44.png)
화면에 변수가 렌더링 되어 잘 출력된다.

가끔 nodemon이 변수가 변경된것을 감지하지 못해 업데이트가 되지 않을 때가 있는데, script에서 그 변경도 항상 감지하도록 옵션을 걸어주면 편하다.

```
"start": "nodemon -e js,html app.js"
```

## template 상속

상단의 메뉴와 같은 부분은 모든 페이지에 출력되는 공통 사항이다. 모든 페이지에 같은 메뉴 코드를 작성해놓는 것보다 Nunjucks의 템플릿 상속 기능을 사용하면 깔끔하게 관리 할 수 있다.

base가 될 html 파일을 생성한다. 그리고 body 부분을 아래 코드처럼 짠다.

```html
<head>
  <!--something-->
  <title>{{title}}</title>
</head>
<body>
  <section class="menu">
    <!-- something something....-->
  </section>
  <div class="container" style="padding-top: 10px;">
    {% block content %}{% endblock %}
  </div>
</body>
```

이런식으로 base template을 만들어 놓고 이제 다른 페이지 레이아웃에서 이를 상속받아 사용하면 된다.
상속은 다음과 같이 한다.

```js
{% set title = "관리자 페이지" %}
{% extends "layout/base.html" %}
```

## Macro 기능

Nunjucks의 유용한 기능중 하나는 Macro 기능이다.

웹 페이지의 메뉴 탭에서 현재 들어와있는 메뉴의 탭 색깔을 변경하는 경우 `if`문을 사용해 아래와 같이 쓸 수 있다.

```html
 <li {% if req_path=='/admin/products'%} class="active" {% endif %}>
  <a href="/admin/products">List</a>
</li>
<li {% if req_path=='/admin/products/write'%} class="active" {% endif %}>
<!-- 중략 -->
```

하지만 이런 작업을 해야하는 엘리먼트의 수가 계속해서 늘어난다면 엄청나게 피곤해질 것이다. 이런 작업을 도와주는 기능이 Nunjucks의 Macro 기능이다.

## Macro 사용법

먼저 현재 url을 통해 어느 메뉴를 활성화 시켜야 하는지 알 수 있기 때문에 클라이언트의 요청 url을 전역 변수로 지정해놓는다. `request.path` 변수가 url을 가리키는 변수이다.

```js
app.use((req, res, next) => {
  app.locals.req_path = req.path;
  next();
});
```

매크로를 정의하기 위한 폴더와 내부에 파일을 새로 생성해 정의한다.

```html
{% macro link( href, text, current_url) %}
    <li {% if href == current_url %} class="active" {% endif %}>
        <a href="{{ href }}">{{text}}</a>
    </li>
{% endmacro %}
```

그리고 매크로를 적용할 html 파일에 매크로를 불러와 적용하면 된다.

```html
{% from "macro/link.html" import link %} {{ link('/admin/products', "List",
req_path) }} {{ link('/admin/products/write', "Write", req_path) }}
```

위에 작성했던 코드보다 훨씬 깔끔하게 정리되었다.

## Reference

[Top 17 Templating Engines for JavaScript 2020](https://colorlib.com/wp/top-templating-engines-for-javascript/)
[killer feature of nunjucks](https://css-tricks.com/killer-features-of-nunjucks/#:~:text=run%20in%20Node.-,js%20and%20used%20to%20compile%20templates%20server%20side.,templates%20with%20quite%20small%20footprint.)
