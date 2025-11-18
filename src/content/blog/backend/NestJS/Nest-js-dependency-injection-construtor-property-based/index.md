---
title: Nest.js dependency injection constructor & property based
description: 'NestJS에는 dependency injection을 하는 다양한 방법이 존재한다. base service를 상속받는 구조로 작성하던 중 construction의 코드가 계속해서 반복되는 현상(bolerplate code)이 나타나 대안을 찾아보니 property based injection을 사용하면 코드 반복을 없…'
pubDate: 2023-08-10 13:34:33
category: backend


---


NestJS에는 dependency injection을 하는 다양한 방법이 존재한다. base service를 상속받는 구조로 작성하던 중 construction의 코드가 계속해서 반복되는 현상(bolerplate code)이 나타나 대안을 찾아보니 property based injection을 사용하면 코드 반복을 없앨 수 있음을 알게되었다. 두 방식의 장점과 단점을 정리해두려고 한다.

## Boilerplate code

클래스에 많은 의존성이 있을 경우 각 의존성을 생성자에서 받아와 저장해야 하는데, 이 경우 생성자 코드가 길어지고 비슷한 코드가 반복된다. 이런 코드를 bolierplate code라고 한다.

```typescript
// Dependency A
class ServiceA {}

// Dependency B
class ServiceB {}

// Dependency C
class ServiceC {}

// Class with Constructor Injection
class MyClass {
  constructor(
       readonly serviceA: ServiceA, 
       readonly serviceB: ServiceB,
       readonly serviceC: ServiceC,
  ) {}
}
```

이미 생성자 코드가 길어졌다. 이렇게 길어진 코드를 **Boilerplate code**라고 한다. 여기서 `MyClass`를 상속받는 경우 코드는 가독성을 더욱더 잃게 된다.

```ts
class ChildClass extends MyClass{
    constructor(
         readonly serviceA: ServiceA,
         readonly serviceB: ServiceB,
         readonly serviceC: ServiceC,
    ) {
        super(serviceA, serviceB, serviceC)
    }
}
```

## Constructor Injection

### 장점
- 명확한 의존 관계 선언: 생성자를 통한 의존성 주입은 확실하고 명확한 의존성을 선언할 수 있다. 해당 클래스에 어떤 의존성이 있는 지 한 눈에 확인 할 수 있다.
- 의존성의 불변성: 생성자를 통해 주입된 의존성은 일반적으로 객체의 lifecycle 동안 불변성을 가지게 된다. 이를 통해 예상치못한 변화나 사이드이펙트를 없앨 수 있다.
- 테스트 가용성: 테스트 시 mock나 stub를 주입하기 편하다. 유닛 테스트 시 독립된 구조에서 더욱 효과적으로 테스트를 진행 할 수 있다.
- 좋은 디자인 구조: 생성자 주입은 SRP(Single Responsibility Principle)을 따르며 더 깔끔하고 모듈화 된 코드를 만들어 준다. 과도한 의존 관계를 가진 클래스는 SRP를 위반 할 가능성이 높다.

### 단점
- Boilerplate code: 여러 개의 의존성을 가질 경우 생성자 코드가 길어진다. 이는 boilerplate code로 이어질 수 있다.
- 초기화 순서를 맞춰야 함: 올바른 순서로 의존성을 초기화 하는 것이 어려운 경우가 있다. 특히 circular 의존성을 가지는 경우 더욱 그렇다.

## Property-Based Injection

### 장점
- 간단한 초기화: 생성자 코드가 짧아진다.
- 유연성: 객체 생성 이후에도 의존성을 새로 세팅하거나 변경 할 수 있다. 의존성에 따른 동적인 세팅을 원한다면 장점이 될 것이다.
- default 의존성 주입 가능: default 값을 의존성으로 세팅한 뒤 필요에 따라 추후에 override 하는 방식으로 코드를 작성할 수 있다. 유연성이 올라간다.

### 단점
- 숨겨진 의존성: 생성자를 통한 의존성 주입에 비해 의존성이 명확하게 드러나지 않아 클래스의 구조를 파악하는 게 힘들어진다.
- 변경가능성: 값 기반 의존성 주입은 값이 변할 수 있다는 단점이 있다. 이는 런타임에 예상치 못한 결과를 불러올 수 있다.
- 테스트가 어려움: 테스트가 어려워진다. 메소드를 호출하기 전에 모든 값이 제대로 세팅 되었는지 확인해야 한다.

## 결론

반복되는 코드를 줄이고자 property based injection으로 전환할까 했지만 테스트하기에 더 좋은 구조인 constructor injection 구조를 유지하기로 했다.
Nest.js 에서 권장되는 구조는 constructor injection이다. 이 방식이 모듈화와 유지보수성이 더 좋고 테스트 하기도 쉽기 때문이다. 하지만 property-based injection 또한 상황에 따라 유용하게 쓰일 수 있다. 예를 들어 동적인 의존성이 필요한 경우가 그렇다. 따라서 프로젝트의 성격에 맞는 방식을 선택하면 될 것으로 보인다.



## 참고

- [NestJS 속성 기반 주입](https://optimuslee.tistory.com/69)
