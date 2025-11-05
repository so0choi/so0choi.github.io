---
title: ConfigService로 환경변수 사용하기
description: 'ConfigService 사용하기 프로젝트 환경에 관련된 변수들이 있다. 예를들면 DB에 관한 정보라던가 AWS 접근 정보라던가. 이런 정보들을 .env에서 관리하도록 프로젝트를 구성했다면 으로 변수에 접근할 수 있다. 하지만 이렇게 하는 것은 NestJS에서 선호하는 방식은 아니다. NestJS에서는 을 사용하기를 권…'
pubDate: 2021-05-23 23:01:48
category: NestJS
tags:
  - NestJS

---


# ConfigService 사용하기

프로젝트 환경에 관련된 변수들이 있다. 예를들면 DB에 관한 정보라던가 AWS 접근 정보라던가. 이런 정보들을 .env에서 관리하도록 프로젝트를 구성했다면 `process.env.`으로 변수에 접근할 수 있다. 하지만 이렇게 하는 것은 NestJS에서 선호하는 방식은 아니다. NestJS에서는 `ConfigService`을 사용하기를 권장한다.

[공식 문서 - Usig the ConfigService](https://docs.nestjs.com/techniques/configuration#using-the-configservice)

문서에 따르면 ConfigModule을 import해서 쓰면 된다고 한다. 하지만 다른 setting이 있는 경우 **global module**로 설정해서 사용할 수도 있다. 그럼 ConfigModule을 또다시 import 할 필요 없다!

```js
ConfigModule.forRoot({
  isGlobal: true,
});
```

나 또한 `app.module.ts`에서 ConfigModule에 `joi` 사용을 세팅했기 떄문에 `isGlobal : true`로 설정해 사용했다.

```js
ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        ...
      }),
    }),
```

그리고 feature module에서는 ConfigService를 import한다.

```js
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigService],
})
```

feature의 service 모듈에서는 이제 이 ConfigService 모듈로 환경변수에 접근이 가능하다.

```js
import { ConfigService } from '@nestjs/config';

export class UsersService {
    constructor(
        private readonly config: ConfigService,
    )
}
```

`get()`을 사용해 접근한다.

```js
console.log(this.config.get("SECRET_KEY"));
```

## `forRoot()`

위의 ConfigModule을 global로 설정할 때 **forRoot()**를 사용했다. forRoot()는 module을 설정할 때 사용한다. return type을 보면 Dynamic Module을 반환하고있다. 동적인 모듈은 결과적으로는 모두 정적 모듈이 된다. Nest에서 모듈 파일들은 forRoot()를 통해 동적으로 세팅이 가능하고 최종적으로는 정적인 모듈이 되어 반환된다.
