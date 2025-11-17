---
title: "[Node.js] POST 처리하기"
description: 'body parser http 연결에서 클라이언트는 get과 post 방식으로 서버에 요청을 보낼 수 있다. get 방식은 정보를 조회할때 사용되는데, 이미 으로 앞에서도 많이 사용한 적이 있다. post 요청을 처리하는 메서드는 가 있다. get과 비슷한 방식으로 처리한다. post는 html DOM의 form을 통해…'
pubDate: 2020-08-31 19:08:31
tags: Node.js
category: Node.js

---


# body-parser

http 연결에서 클라이언트는 get과 post 방식으로 서버에 요청을 보낼 수 있다. get 방식은 정보를 조회할때 사용되는데, 이미 `app.get()` 으로 앞에서도 많이 사용한 적이 있다.
post 요청을 처리하는 메서드는 `post()`가 있다. get과 비슷한 방식으로 처리한다. post는 html DOM의 form을 통해 전달되는데, form을 처리하기 위해 Node.js의 `body-parser`라는 내장 모듈을 사용한다. body parser는 Express의내장 모듈이기 때문에 따로 설치하지 않아도 된다. _예전에는 설치후 사용해야 했지만 어느 버젼 이후 내장 모듈로 바뀌었다고 한다._

```js
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
```

Body-parser를 미들웨어로 설정하여 사용한다.

- `bodyParser.json()` : JSON 객체를 parsing한다.
- `bodyParser.urlencoded()` : url로부터 body를 parsing 한다. `extended`속성이 false일 경우 value가 `string`또는 `array`인 경우에만 return을 하고, `true`인 경우 type제한이 없다.

참고 - [Stackoverflow](<https://stackoverflow.com/questions/55558402/what-is-the-mean-of-bodyparser-urlencoded-extended-true-and-bodyparser#:~:text=A%20new%20body%20object%20containing,(when%20extended%20is%20true).>)

## post 처리하기

```js
router.post("/products/write", (req, res) => {
  res.send(req.body);
});
```

앞서 말한대로 post를 처리하기 위해 `post()`를 사용한다. `app.js`에서 `body-parser`를 미들웨어로 설정했기 때문에 `requset` 객체의 `body`를 통해 클라이언트가 전송한 `form`을 읽을 수 있다.
`body`는 html에서 지정한 각 개체의 `name`과 내부 `input`의 key-value 구조로 이뤄잊 JSON 객체이다.
