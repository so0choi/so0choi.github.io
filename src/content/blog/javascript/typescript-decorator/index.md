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

## 두 가지 데코레이터

TypeScript에는 데코레이터가 두 종류 있다.

| | Legacy (experimental) | 표준 (TC39 Stage 3) |
|---|---|---|
| 지원 버전 | 예전부터 | TypeScript 5.0+ |
| 설정 | `experimentalDecorators: true` 필요 | 설정 없이 사용 |
| 파라미터 데코레이터 | 지원 | 미지원 |
| `emitDecoratorMetadata` | 지원 | 미지원 |
| 사용처 | NestJS, TypeORM, Angular 등 | 새로 작성하는 코드 |

NestJS나 TypeORM은 파라미터 데코레이터와 `reflect-metadata`에 의존하기 때문에 여전히 legacy 방식을 쓴다. NestJS 프로젝트의 `tsconfig.json`을 보면 아래 옵션이 켜져 있다.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

아래 예제는 legacy 방식 기준이다.

## 데코레이터 종류

### 클래스 데코레이터

클래스 생성자를 인자로 받는다.

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

`original.apply(this, args)`로 원래 메서드를 호출하는 부분이 중요하다. `this`를 넘기지 않으면 메서드 안의 `this`가 깨진다.

### 프로퍼티 데코레이터

`target`과 프로퍼티 이름을 받는다. 디스크립터가 없어서 값을 직접 바꾸기보다는 메타데이터를 기록하는 용도로 쓴다.

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

`class-validator`의 `@IsString()`, `@IsEmail()`이 이런 식으로 동작한다.

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

`emitDecoratorMetadata`를 켜면 TypeScript가 컴파일할 때 데코레이터가 붙은 클래스의 생성자 파라미터 타입을 `design:paramtypes` 메타데이터로 남긴다.

```ts
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
```

NestJS는 이 메타데이터를 읽어서 `UserService`를 만들 때 `UserRepository`를 주입해야 한다는 것을 안다. 클래스에 데코레이터가 하나도 없으면 메타데이터가 생성되지 않기 때문에, 주입받는 쪽 클래스에 `@Injectable()`이 필요한 것이다.

## 참고

- [TypeScript Handbook - Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [TypeScript 5.0 Release Notes - Decorators](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#decorators)
- [NestJS - Custom decorators](https://docs.nestjs.com/custom-decorators)
