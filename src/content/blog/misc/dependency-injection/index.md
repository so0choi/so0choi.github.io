---
title: Dependency Injection
description: 'Understanding dependency injection Dependency injection, 또는 DI는 Angular의 기본 컨셉입니다. DI는 Angular 프레임워크에 결합되어 Components, Directives, Pipes, Injectables과 같은 decorator로 class를 필요에 맞게…'
heroImage: './dependency-injection.png'
pubDate: 2022-12-27 13:16:33
category: misc



---



> Angular Document - [Understanding dependency injection](https://angular.io/guide/dependency-injection#understanding-dependency-injection) 해석

## Understanding dependency injection

Dependency injection, 또는 DI는 Angular의 기본 컨셉입니다. DI는 Angular 프레임워크에 결합되어 Components, Directives, Pipes, Injectables과 같은 decorator로 class를 필요에 맞게 설정할 수 있도록 합니다.

DI 시스템의 두 가지 주요한 역할은 다음과 같습니다: dependency consumer와 dependency provider

Angular는 Injector라는 추상화를 이용해 dependency consumer와 dependency provider 사이의 상호작용을 용이하게 합니다. dependency가 요청되면, injector는 이미 사용 가능한 instance가 존재하는지 registry부터 확인합니다. 사용 가능한 instance가 존재하지 않는다면, 새로운 instance를 생성해 registry에 저장합니다. Angular는 application bootstrap을 실행하면서 application-wide injector("root" injector라고도 합니다)와 필요한 다른 Injector들을 생성합니다. 대부분의 경우에는 자체적으로 injector를 생성해야하는 일은 없을 것 입니다. 하지만 provider와 consumer라는 컨셉이 있다는 것은 알고있어야 합니다.

이 글에서는 어떻게 class가 dependency를 다루는지에 대한 기본 시나리오를 다룹니다. Angular는 functions, objects, 또는 string or Boolean과 같은primitive type 또한 dependency에 사용할 수 있도록 하고 있습니다. 이것에 대한 더 많은 정보는 이 곳을 참조하시길 바랍니다. [Dependency providers](https://angular.io/guide/dependency-injection-providers)

## Providing dependency

component 내부에서 dependency를 가지는 HeroService 라는 class가 있다고 상상해봅시다.

첫 번째로 해야 할 일은 class가 inject 될 수 있도록 @Injectable decorator를 추가하는 것입니다.

```js
@Injectable()
class HeroService{}
```

다음 단계는 이 class가 사용될 수 있도록 제공하는 것입니다. dependency는 다양한 방법으로 제공될 수 있습니다.

- component 수준에서는 @Component decorator의 `provider` 필드를 사용하면 됩니다. 이렇게 하면 HeroService는 이 component의 다른 모든 instance와 다른 component에서 사용이 가능해집니다. 아래와 같이 할 수 있습니다.

```js
@Component({
  selector: 'hero-list',
  template: '...',
  providers: [HeroService]
})
class HeroListComponent {}
```

Provider를 comoponent 수준에서 정의하면 그 component의 instance가 생성될 때마다 새로운 service instance를 생성하게 됩니다.

- application root 수준에서 정의할 경우 application 내부의 모든 class에서 inject 할 수 있습니다. @Injectable decorator에 `providedIn: 'root'`를 추가하여 사용할 수 있습니다.

```js
@Injectable({
  providedIn: 'root'
})
class HeroService {}
```

root 수준에서 service를 제공하면 Angular는 하나의 공유되는 HeroService를 생성하여 해당 provider를 요청하는 class들에 inject 합니다. @Injectable metadata로 provider를 정의하면 tree-shaking이라고 알려진 방식으로 사용되지 않는 service는 Angular가 compile된 application에서 제거하여 app을 최적화 시킬 수 있도록 합니다.

## Injecting a dependency

dependency를 inject하는 가장 보편적인 방법은 class 생성자에 선언하는 것입니다. Angular가 component, directive나 pipe class의 instance를 새로 생성할 때, Angular를 해당 class 생성자 파라미터의 type을 보고 어떤 service나 다른 dependency가 필요한지를 살펴봅니다. 예를들어, HeroListComponent에는 HeroService가 필요합니다. 생성자는 다음과 같습니다.

```ts
@Component({ … })
class HeroListComponent {
  constructor(private service: HeroService) {}
}
```

Angular가 component가 service에 dependency를 가진다는 것을 발견하면 Angular는 먼저 해당 service의 instance가 이미 존재하는지를 확인합니다. 만약 필요한 service instance가 아직 생성되지 않은 경우, injector는 등록된 provider를 사용해 instance를 생성합니다. 그리고 service를 Angular에 다시 되돌려주기 전에 생성한 instance를 injector에 추가합니다.

모든 service가 처리되고 반환되었다면 Angular는 그 service들을 argument로 사용하여 component의 생성자를 호출할 수 있게 됩니다.

> ![](./dependency-injection.png)