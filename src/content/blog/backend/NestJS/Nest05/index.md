---
title: Middleware
description: 'Middleware 미들웨어는 route handler 이전에 실행되도록 하는 함수이다. , 객체에 접근할 수 있고 라는 미들웨어 함수가 사용된다. 에서 흔히 사용되는 미들웨어와 같은 개념이다. 구현 Nest에서 미들웨어는 함수 또는 클래스로 구현이 가능하다. 클래스로 만들경우 인터페이스를 구현해야한다. 함수로 구현하는…'
pubDate: 2021-06-06 01:35:25
category: backend
tags:
  - NestJS
  - middleware





---



미들웨어는 route handler 이전에 실행되도록 하는 함수이다. `request`, `response` 객체에 접근할 수 있고 `next()`라는 미들웨어 함수가 사용된다. `express`에서 흔히 사용되는 미들웨어와 같은 개념이다.

## 구현

Nest에서 미들웨어는 함수 또는 클래스로 구현이 가능하다. 클래스로 만들경우 `NestMiddleware` 인터페이스를 구현해야한다.

```js
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request...");
    next();
  }
}
```

함수로 구현하는 경우 다음과 같이 할 수 있다.

```js
import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
```

## 적용

미들웨어는 여러 방식으로 적용이 가능하다. 한가지 방식으로 `AppModule`에서 적용할 수 있다. 아래와 같이 `configure()` 메서드를 사용한다.

```js
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("cats");
  }
}
```

위는 `/cats` 라우트 핸들러가 `LoggerMiddleware`를 사용하도록 한 방식이다. 옵션을 추가해 특정 http method에만 동작하도록 할 수도 있다.

```js
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "cats", method: RequestMethod.GET });
  }
}
```

이런식으로 작성하게 되면 해당 미들웨어는 `GET` 메서드에만 동작한다.
`*` 와 같은 몇가지 문자들은 path 옵션에서 와일드 카드로 사용된다. `path : '*'` 설정은 모든 path에서 동작하겠다는 것과 같다.
특정 path에서만 동작할 수 있는 것 처럼 배제시킬 수도 있는데 `exclude`를 사용하면 된다.

```js
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: "cats", method: RequestMethod.GET },
    { path: "cats", method: RequestMethod.POST },
    "cats/(.*)"
  )
  .forRoutes(CatsController);
```

이제 이 미들웨어는 `/cats` path의 `GET`과 `POST` 요청에서는 동작하지 않을 것이다.

### multiple middleware

미들웨어를 여러개 사용할 경우 ','를 사용해 차례대로 적용할 수 있다.

```js
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

### global middleware

애플리케이션 전체에서 동작하는 미들웨어의 경우 `main.ts` 파일에서 사용하면 된다.

```js
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

주의해야 할 점은, `app`에서는 functional middleware만 사용가능하다는 점이다. class middleware를 사용하려고 하면 아래와 같은 오류가 발생한다.

```
[Nest] 31625   - 2021-06-06 3:10:29 ├F10: AM┤   [ExceptionsHandler] Class constructor JwtMiddleware cannot be invoked without 'new' +1912ms
```

## 참고

- [Official doc - nestjs/middleware](https://docs.nestjs.com/middleware)
