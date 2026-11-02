---
title: "Typescript decorator 알아보기"
description: "데코레이터는 클래스, 메서드, 프로퍼티, 파라미터에 붙여 동작을 추가하거나 메타데이터를 다는 문법이다. TypeScript의 experimentalDecorators 방식과 TS 5.0의 표준 데코레이터 차이, 그리고 NestJS에서 어떻게 쓰이는지 정리했다."
pubDate: 2026-10-26 14:53:29
category: javascript
tags:
  - TypeScript
  - Decorator
---

# Typescript decorator 알아보기

데코레이터는 클래스나 클래스 멤버에 `@` 문법으로 붙여서 기능을 추가하거나 메타데이터를 다는 기능이다. NestJS의 `@Controller()`, `@Injectable()`, TypeORM의 `@Entity()`, `@Column()` 같은 것들이 전부 데코레이터다.

데코레이터 자체는 결국 **함수**다. `@log`라고 쓰면 대상(클래스, 메서드 등)을 인자로 받아 `log` 함수가 실행된다.

## legacy vs TC39 표준 데코레이터

TypeScript에는 데코레이터가 두 종류 있다.

| | Legacy (experimental) | 표준 (TC39 Stage 3) |
| --- | --- | --- |
| 지원 버전 | - | TypeScript 5.0+ |
| 설정 | `experimentalDecorators: true` 필요 | 설정 없이 사용 |
| 파라미터 데코레이터 | 지원 | 미지원 |
| `emitDecoratorMetadata` | 지원 | 미지원 |
| 사용처 | NestJS, TypeORM, Angular 등 | 새로 작성하는 코드 |

NestJS나 TypeORM은 파라미터 데코레이터와 `reflect-metadata`에 의존하기 때문에 여전히 legacy 방식을 쓴다. 그래서 NestJS 프로젝트의 `tsconfig.json`을 보면 아래 옵션이 켜져 있다.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

나는 NestJS를 주로 사용하기 때문에 legacy 방식이 익숙하며 이를 더 알아보고자 한다. 따라서 아래 예제도 legacy 방식 기준으로 작성한다.

## 데코레이터의 종류

### 클래스 데코레이터

클래스 생성자를 인자로 받아 함수를 실행한다.

```ts
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class User {
  name = "soyeong";
}
```

### 메서드 데코레이터

`target`(프로토타입), 메서드 이름, 프로퍼티 디스크립터를 받는다. 디스크립터의 `value`를 바꿔치기해서 메서드를 감쌀 수 있다.

```ts
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`${propertyKey} 호출`, args);
    return original.apply(this, args);
  };
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}

new Calculator().add(1, 2); // add 호출 [1, 2]
```

`original.apply(this, args)`로 원래 메서드를 호출하는 부분이 중요하다.

#### 디스크립터

객체의 프로퍼티나 메서드가 어떤 특성을 가지고 있는지 정의하는 객체. JavaScript의 `PropertyDescriptor` 객체는 단순히 객체의 값 뿐 아니라 이 값이 수정이나 삭제가 가능한지 등의 속성을 나타낸다. 내부 속성은 다음과 같다.

|속성|설명|
|--|--|
|value|프로퍼티의 실제 값. 메서드라면 함수|
|writable|값을 변경할 수 있는지|
|enumerable|열거 대상인지 (Object.keys 등)|
|configurable|삭제하거나 속성 정의를 변경할 수 있는지|
|get / set|getter 및 setter 함수|

### 프로퍼티 데코레이터

클래스 프로퍼티에 데코레이터를 붙이면 데코레이터 함수의 첫 번째 인자 `target`으로 해당 클래스의 prototype이 전달된다. 그 `target`과 프로퍼티의 이름을 전달 받는다. 프로퍼티 데코리에터에는 디스크립터가 없고, 메서드 데코레이터처럼 값을 직접 바꾸기보다는 메타데이터를 기록하는 용도로 쓴다.

```ts
function required(target: any, propertyKey: string) {
  const fields = Reflect.getMetadata("required", target) ?? [];
  Reflect.defineMetadata("required", [...fields, propertyKey], target);
}

class CreateUserDto {
  @required
  email: string;
}
```

`class-validator`의 `@IsString()`, `@IsEmail()`이 이런 식으로 동작한다. 데코레이터가 프로퍼티 값을 직접 검사하는 건 아니고, 어떤 검증을 해야 하는지 메타데이터로 등록해둔다.

```ts
import { IsEmail, IsString, validate } from 'class-validator';

class CreateUserDto {
  @IsString() // 이걸 붙인다고 string 타입이 되는 건 아님
  name: string;

  @IsEmail() // 이걸 붙인다고 무조건 email이 되는 건 아님
  email: string;
}

const dto = new CreateUserDto();

dto.name = 123 as any;
dto.email = 'invalid-email';

const errors = await validate(dto); // 검증은 여기서 발생한다. 이때 검증을 decorator를 통해 추가된 메타데이터 검증 규칙을 보고 한다는 것

console.log(errors);
```

Typescript의 타입은 컴파일 이후 런타임 시에 대부분 사라지기 때문에 런타임에서 사용할 검증 규칙을 별도로 등록해 사용한다고 볼 수도 있다.

#### NestJS의 ValidationPipe

NestJS까지 확장해 생각해보자.

```ts
@Post()
createUser(@Body() dto: CreateUserDto) {
  return this.userService.create(dto);
}
```

이제 이 코드가 제대로 이해될 것이다. `ValidationPipe`가 활성화되어 있다면 요청이 들어왔을 때 DTO 클래스를 확인할 것이다.

1. 애플리케이션 로딩: 데코레이터가 검증 규칙 등록
2. HTTP 요청 수신: 요청 본문이 전달됨
3. ValidationPipe 실행: DTO 타입을 확인하고 검증할 객체를 준비
4. class-validator 실행: 저장된 검증 규칙과 실제 값을 비교
5. 검증 실패: 기본 설정에서는 HTTP 400 응답
6. 검증 성공: 컨트롤러 메서드 실행

#### Reflect.defineMetadata

클래스, 메서드, 프로퍼티 등에 메타데이터를 저장하는 함수로, JavaScript 내장 함수는 아니고 `reflect-metadata` 라이브러리가 제공하는 함수이다. NestJS에서 데코레이터가 어떻게 동작하는지 이해하려면 알아두는 게 좋다.

- 메타데이터: 데이터에 대한 추가 정보

`Reflect.defineMetadata`를 사용해 메타데이터를 저장하고 조회할 수 있다.

```ts
import 'reflect-metadata';

class UserService {
  getUser() {
    return 'user';
  }
}

// 메타데이터 저장
Reflect.defineMetadata(
  'role',                  // 메타데이터 키
  'admin',                 // 메타데이터 값
  UserService.prototype,   // 대상 객체
  'getUser',               // 대상 프로퍼티 이름
);

// 메타데이터 조회
const role = Reflect.getMetadata(
  'role',
  UserService.prototype,
  'getUser',
);

console.log(role); // 'admin'
```

### 파라미터 데코레이터

`target`, 메서드 이름, 파라미터 인덱스를 받는다. NestJS의 `@Body()`, `@Param()`이 여기에 해당한다.

```ts
@Controller("users")
export class UserController {
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }
}
```

## 데코레이터 팩토리

`@Controller("users")`처럼 인자를 받는 데코레이터는 **데코레이터를 반환하는 함수**다.

```ts
function logWithPrefix(prefix: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.log(`[${prefix}] ${propertyKey}`);
      return original.apply(this, args);
    };
  };
}

class OrderService {
  @logWithPrefix("ORDER")
  create() {}
}
```

## 실행 순서

- 데코레이터는 **클래스가 정의될 때** 한 번 실행된다. 인스턴스를 만들 때마다 실행되는 게 아니다.
- 한 대상에 여러 개를 붙이면 팩토리는 위에서 아래로 평가되고, 데코레이터 함수는 아래에서 위로 적용된다.

```ts
function first() {
  console.log("first(): factory");
  return (target: any, key: string, desc: PropertyDescriptor) => console.log("first(): called");
}

function second() {
  console.log("second(): factory");
  return (target: any, key: string, desc: PropertyDescriptor) => console.log("second(): called");
}

class Example {
  @first()
  @second()
  method() {}
}

// first(): factory
// second(): factory
// second(): called
// first(): called
```

## emitDecoratorMetadata와 NestJS DI

```ts
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
```

위 코드에서 NestJS는 생성자에 타입만 선언해을 뿐인데 해당 레포지토리 클래스의 인스턴스를 주입해준다. NestJS가 어떻게 저게 필요한 걸 알고 넣어주는 걸까? 그 역할을 `emitDecoratorMetadata`와 `design:paramtypes` 요것들이 해주는 것이다.

`emitDecoratorMetadata`를 켜면 TypeScript가 컴파일할 때 데코레이터가 붙은 클래스의 생성자 파라미터 타입을 `design:paramtypes` 메타데이터로 남긴다.

코드를 단순화하면 아래와 같다.

```js
let UserService = class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
};

UserService = __decorate([
  Injectable(),

  __metadata("design:paramtypes", [UserRepository])
], UserService);
```

NestJS가 `Injectable` 메타데이터를 읽으면 `UserService`를 만들 때 `UserRepository`를 주입해야 한다는 것을 안다. 클래스에 데코레이터가 하나도 없으면 메타데이터가 생성되지 않기 때문에, 주입받는 쪽 클래스에 `@Injectable()`이 필요한 것이다. 이 또한 Typescript가 컴파일되면 타입 정보다 런타임에 남지 않는 문제를 해결하기 위해 사용된다고 볼 수 있다.

다만 `Injectable`은 NestJS가 제공하는 데코레이터고 `design:paramtypes`는 TypeScript 컴파일러가 생성하는 메타데이터이다. `Injectable`이 아니더라도 NestJS DI는 가능하다. 다른 커스텀 데코레이터나 `Inject`를 통한 명시적 토큰 지정 등 다양한 방식으로 사용할 수 있다.

## 참고

- [TypeScript Handbook - Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [TypeScript 5.0 Release Notes - Decorators](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#decorators)
- [NestJS - Custom decorators](https://docs.nestjs.com/custom-decorators)
