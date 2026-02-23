---
title: NestJS란
description: 'NestJS NestJS? NestJs는 Node.js용 프레임워크이다. Typescript를 전격 지원하고 OOP(Object Oriented Programming), FP(Functional Programming), FRP(Functional Reactive Programming)으로 이루어져있다. NestJS는 N…'
heroImage: './2021-08-23-21-48-08.png'
pubDate: 2021-08-23 21:37:25
category: backend
tags:
  - NestJS






---



# NestJS

## NestJS?

NestJs는 Node.js용 프레임워크이다. Typescript를 전격 지원하고 OOP(Object Oriented Programming), FP(Functional Programming), FRP(Functional Reactive Programming)으로 이루어져있다.

NestJS는 Node.js에서 사용되던 Express, Fastify 위에서 동작한다. 기본은 Express를 동작하고 있으며 추가 설정을 통해 Fastify를 사용할 수도 있다.
위 두 http 프레임워크는 가장 많이 통용되고 있었으나 가장 큰 단점이 정해진 **구조**가 없다는 것이었다. 그런 단점을 NestJS가 보완하고 있는 것이다.
NestJS를 사용해 더 구조적으로 안정된 애플리케이션을 구현할 수 있을 것이다.

## Nest CLI

NestJS 프로젝트는 cli를 통해 간단히 생성할 수 있다. 명령어를 사용하면 간단한 scaffold를 생성해준다.

```
npm i -g @nestjs/cli
nest new [project-name]
```

타입스크립트로 생성하고 싶다면 깃을 사용할 수 있다.

```
git clone https://github.com/nestjs/typescript-starter.git project
cd project
npm install
npm run start
```

![](./2021-08-23-21-48-08.png)

이런 구조로 프로젝트가 생성된다.

```
npm run start
```

명령어로 애플리케이션을 실행한다. `localhost:3000`에서 확인할 수 있다.

## Structure

### main.ts

`main.ts`은 애플리케이션이 시작되는 entry file이다.() `main.ts`는 `NestFactory` function을 사용해 Nest 애플리케이션 인스턴스를 생성한다.

```js
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

대충봐도 3000번 포트에 Nest 애플리케이션을 생성하는 코드임을 알 수 있다. `create`에서 사용하는 `AppModule`을 살펴보자

### AppModule

```js
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

'@'가 붙은 이상하게 생긴 저것은 데코레이터다. 데코레이터는 class에 functionality를 추가하기위해 사용된다. class용 function이다. Controller부터 살펴보자.

### Controller

```js
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello: string {
    return this.appService.getHello();
  }
}
```

Controller는 url을 받아서 처리하는 역할을 한다. 여기도 몇가지 데코레이터가 사용된다. Controller 역할을 부여하기 위해 `@Controller()`를 사용하고, `GET`요청을 처리하기 위해 `@Get()` 을 사용하고 있다.

### Service

실제 비즈니스 로직은 Service에서 처리한다. 위 Controller에서도 생성자 내부에서 `appService`를 생성해 `GET` 처리에 사용하고 있다. 위 AppModule에서는 AppService가 `Provider`로 들어가있는데, Nest에서는 service, repository,, factory, helper 등등 다양한 요소들을 Provider로 정의한다.
Provider로 여겨지는 가장 큰 이유는 의존성을 주입할 수 있다는 점이다. 각 object들이 다양한 관계, 즉 의존성을 맺을 수 있다. `app.service.ts`는 다음과 같다.

```js
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }
}
```

여기서는 `@Injectable()` 데코레이션으로 이 클래스는 다른 object에 포함시켜 사용할 수 있음을 나타낸다.
