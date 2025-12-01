---
title: NestJS - Serialization
description: somthing
heroImage: something
tags:
  - NestJS
category: backend
---

Serialization 즉 직렬화다. 한국어로 놓고 보면 의미가 잘 와닿지 않는다. 직렬화란 네트워크 응답을 보내기 전에 발생하는 과정이다. 클라이언트에게 데이터를 전송하기 전에 정해진 규칙에 맞게 데이터를 변환하고 정제화 하는 작업을 말한다.

예를 들어 패스워드와 같은 민감한 정보는 항상 응답에서 제외시켜야 하기도 하고, 또는 클라이언트 전달 전에 추가 변형이 필요한 데이터도 있다.

이런 변형 작업들을 수동 처리하는 것은 귀찮기도 하고 에러가 발생하기도 쉬우며 사람이란 실수를 피해갈 수 없기에 분명 커버되지 않는 부분이 남겨질 것이다.

이럴 때 사용할 수 있는 것이 NestJS의 Serialization 테크닉이다.

## Serialization

Nest는 이를 위해 빌트인 기능을 제공하고 있다. `ClassSerializerInterceptor` 인터셉터는 `class-transformer` 패키지를 사용해 직관적이고 확장성있는 객체 변환 기능을 제공한다. 

가장 기본이 되는 동작은 value를 가져다가 `class-transforemer`의 `instanceToPlain()`을 적용하는 것이다. 이 함수를 실행함으로써 `class-transformer`가 확인 가능한 데코레이터로 만든 entity나 DTO를 사용해 객체를 검사해준다.

### Exclude 사용 예

위에 설명했듯 패스워드 속성을 반환 객체에서 제외시키는 코드는 이렇게 작성할 수 있다.


```typescript
// user.entity.ts
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  firstName: string;
  lastName: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
```

컨트롤러에서는 인터셉터만 추가해주면 된다.

```ts
// user.controller.ts

import {UserEntity} from './user.entity.ts';
import {ClassSerializerInterceptor} from '@nestjs/common';

... 

@UseInterceptors(ClassSerializerInterceptor)
@Get()
findOne(): UserEntity {
  return new UserEntity({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
  });
}

```

`UserEntity`를 반환해도 `password`가 자동으로 응답 객체에서 제외된다.

```json
// response object
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe"
}
```

### Expose 사용 예

`@Expose()` 데코레이터를 사용하면 기존 속성을 연산하여 만드는 새로운 속성을 내보낼 수 있다. Java로 치면 getter 느낌이다.

```ts
@Expose()
get fullName(): string {
  return `${this.firstName} ${this.lastName}`;
}
```

Expose를 추가하면 반환 객체에 `fullName`이 추가되어 있다.

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe"
}
```

### Transform 사용 예

`@Transform()`을 사용하면 추가적인 데이터 조작이  가능하다.

```ts
@Transform(({ value }) => value.name)
role: RoleEntity;
```

이 예시는 `RoleEntity`의 전체를 반환하지 않고 `name` 프로퍼티만 반환하게 된다.

### Pass 옵션

변형 함수의 기본 동작도 제어할 수 있다. `@SerializaOptions()` 데코레이터에 옵션을 넘기면 된다.

```ts

@SerializeOptions({
  excludePrefixes: ['_'],
})
@Get()
findOne(): UserEntity {
  return new UserEntity();
}

```

이렇게 하면 `_`로 시작하는 모든 프로퍼티가 자동으로 exclude 된다.

### Controller에서 SerializeOptions로 변환하기

`@SerializaOptions()`을 사용하면 컨트롤러에서도 특정 클래스로 변환이 가능하다. 이렇게 하면 일반 객체를 반환해도 타입 검사를 자동으로 해준다. 그래서 반복적으로 `plainToInstance`를 호출하지 않아도 된다.

```ts

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserEntity })
@Get()
findOne(@Query() { id }: { id: number }): UserEntity {
    // 일반 객체를 반환하지만 UserEntity 타입 변환으로 실행하고 return 된다.
  if (id === 1) {
    return {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    };
  }

  return {
    id: 2,
    firstName: 'Kamil',
    lastName: 'Mysliwiec',
    password: 'password2',
  };
}

```

plainToInstance 함수를 사용하면 코드 작성 레벨에서 타입을 추론하지 못하는 반면, 이렇게 return 타입을 SerializeOptions에 명시해두면 Typescript 타입 체킹을 이 단계에서 받을 수 있다.

## 정리

NestJS에서 Serialization 기능은 부가기능에 가깝다. 내장 인터셉터로 기능 구현이 가능하기 때문에 필요한 경우 사용할 수는 있겠지만 과한 데코레이터 사용의 결과는 구조의 복잡도만 증가시킬 수 있기도 하다. 상황에 맞게 기능을 적절한 사용할 줄 아는 판단력을 가지는 게 더 중요해 보인다. 


## 참고
- [NestJS - Serialization](https://docs.nestjs.com/techniques/serialization)
