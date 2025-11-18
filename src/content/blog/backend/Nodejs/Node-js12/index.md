---
title: "[Node.js] 에러페이지 핸들링"
description: '에러페이지 핸들링 Node.js의 Express 에서 에러 처리를 하려면 어떡헤 해야 할까? 아래의 방식이 내가 주로 사용하던 에러 핸들링 방식이다. , 를 사용해 에러처리를 하고 있다. 하지만 만약 엔드포인트가 계속해서 많아진다면? 에러 처리를 위해 반복 작성되는 코드가 매우 많아질 것이다. Express는 이를 방지…'
pubDate: 2020-08-31 21:03:42
tags:
  - Node.js
category: backend





---


# 에러페이지 핸들링

Node.js의 Express 에서 에러 처리를 하려면 어떡헤 해야 할까?
아래의 방식이 내가 주로 사용하던 에러 핸들링 방식이다.

```js
app.get("/", function (req, res, next) {
  fs.readFile("/file-does-not-exist", function (err, data) {
    if (err) {
      next(err); // Pass errors to Express.
    } else {
      res.send(data);
    }
  });
});
```

`try`, `catch`를 사용해 에러처리를 하고 있다. 하지만 만약 엔드포인트가 계속해서 많아진다면? 에러 처리를 위해 반복 작성되는 코드가 매우 많아질 것이다.

Express는 이를 방지하기 위해 에러처리를 위한 미들웨어를 제공한다.

```js
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
}
```

인자 4개를 받는 함수가 에러핸들러 함수로 사용된다. 작성한 함수를 미들웨어로 지정하면 매 로직에 에러핸들링을 할 필요없이, 에러 발생을 확인하는 과정을 거치고 로직을 수행하게 된다.

따로 함수를 작성하지 않고 아래와 같은 방법으로 정의와 동시에 미들웨어 설정을 할 수도 있다.

```js
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(methodOverride());
app.use(function (err, req, res, next) {
  // logic
});
```

그리고 위에서 지정한 함수를 그대로 미들웨어로 설정할 수도 있다.

```js
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(methodOverride());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
```

## 후기

사실 아직 복잡한 구조를 보면 이해하는데 조금 시간이 걸린다. 실제로 다뤄봐야 제대로 알 수 있을 것 같다.
