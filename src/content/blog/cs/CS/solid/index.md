---
title: SOLID 원칙
description: 'SRP (Single Responsibility Principle) ’클래스를 변경하는 이유가 한 가지 이상 있어서는 안 된다.’는 말이 있다. 한 개의 클래스가 한 가지 일만 하도록 하는 것은 매우 중요하다. 클래스의 기능이 많아질수록 역할이 불분명해지고 의존하고 있는 모듈들에 어떤 영향을 끼칠지 알 수 없기 때문이다…'
pubDate: 2022-09-15 10:31:14
category: cs


---


## SRP (Single Responsibility Principle)

'클래스를 변경하는 이유가 한 가지 이상 있어서는 안 된다.'는 말이 있다. 한 개의 클래스가 한 가지 일만 하도록 하는 것은 매우 중요하다. 클래스의 기능이 많아질수록 역할이 불분명해지고 의존하고 있는 모듈들에 어떤 영향을 끼칠지 알 수 없기 때문이다.

### Bad
```ts
class UserSettings {
  constructor(private readonly user: User) {
  }

  changeSettings(settings: UserSettings) {
    if (this.verifyCredentials()) {
      // ...
    }
  }

  verifyCredentials() {
    // ...
  }
}
```

### Good

```ts
class UserAuth {
  constructor(private readonly user: User) {
  }

  verifyCredentials() {
    // ...
  }
}


class UserSettings {
  private readonly auth: UserAuth;

  constructor(private readonly user: User) {
    this.auth = new UserAuth(user);
  }

  changeSettings(settings: UserSettings) {
    if (this.auth.verifyCredentials()) {
      // ...
    }
  }
}
```
## OCP (Open Closed Principle)

소프트웨어 개체(클래스, 모듈, 함수, 등)는 확장에 열려있지만 변경에는 닫혀있어야 한다. 기존 코드를 수정하지 않으면서 새로운 기능을 추가할 수 있어야 한다는 말이다.

### Bad
```ts
class AjaxAdapter extends Adapter {
  constructor() {
    super();
  }

  // ...
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
  }

  // ...
}

class HttpRequester {
  constructor(private readonly adapter: Adapter) {
  }

  async fetch<T>(url: string): Promise<T> {
    if (this.adapter instanceof AjaxAdapter) {
      const response = await makeAjaxCall<T>(url);
      // transform response and return
    } else if (this.adapter instanceof NodeAdapter) {
      const response = await makeHttpCall<T>(url);
      // transform response and return
    }
  }
}

function makeAjaxCall<T>(url: string): Promise<T> {
  // request and return promise
}

function makeHttpCall<T>(url: string): Promise<T> {
  // request and return promise
}
```

### Good

```ts
abstract class Adapter {
  abstract async request<T>(url: string): Promise<T>;

  // code shared to subclasses ...
}

class AjaxAdapter extends Adapter {
  constructor() {
    super();
  }

  async request<T>(url: string): Promise<T>{
    // request and return promise
  }

  // ...
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
  }

  async request<T>(url: string): Promise<T>{
    // request and return promise
  }

  // ...
}

class HttpRequester {
  constructor(private readonly adapter: Adapter) {
  }

  async fetch<T>(url: string): Promise<T> {
    const response = await this.adapter.request<T>(url);
    // transform response and return
  }
}
```

## LSP (Liskov Substitution Principle)

type S가 type T의 서브 타입이라면 type T는 아무 수정 없이도 type S로 대체될 수 있어야 한다. 다시 말하면 부모 클래스와 자식 클래스가 있을 때 그 둘은 대체 가능해야 한다는 것이다.
'is-A'에 맞다고 하더라도 상위 타입에서 정의한 조건중 부합하지 않는게 있다면 이를 상속받아서는 안된다.  

### Bad

```ts
class Rectangle {
  constructor(
    protected width: number = 0,
    protected height: number = 0) {

  }

  setColor(color: string): this {
    // ...
  }

  render(area: number) {
    // ...
  }

  setWidth(width: number): this {
    this.width = width;
    return this;
  }

  setHeight(height: number): this {
    this.height = height;
    return this;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width: number): this {
    this.width = width;
    this.height = width;
    return this;
  }

  setHeight(height: number): this {
    this.width = height;
    this.height = height;
    return this;
  }
}

function renderLargeRectangles(rectangles: Rectangle[]) {
  rectangles.forEach((rectangle) => {
    const area = rectangle
      .setWidth(4)
      .setHeight(5)
      .getArea(); // BAD: Returns 25 for Square. Should be 20.
    rectangle.render(area);
  });
}

const rectangles = [new Rectangle(), new Rectangle(), new Square()];
renderLargeRectangles(rectangles);
```

### Good

```ts
abstract class Shape {
  setColor(color: string): this {
    // ...
  }

  render(area: number) {
    // ...
  }

  abstract getArea(): number;
}

class Rectangle extends Shape {
  constructor(
    private readonly width = 0,
    private readonly height = 0) {
    super();
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Shape {
  constructor(private readonly length: number) {
    super();
  }

  getArea(): number {
    return this.length * this.length;
  }
}

function renderLargeShapes(shapes: Shape[]) {
  shapes.forEach((shape) => {
    const area = shape.getArea();
    shape.render(area);
  });
}

const shapes = [new Rectangle(4, 5), new Rectangle(4, 5), new Square(5)];
renderLargeShapes(shapes);
```

## ISP (Interface Segregation Principle)

클라이언트에게 굳이 필요없는 인터페이스를 노출시키지 말아야 한다는 뜻이다. SRP와도 연관이 있다. 클라이언트에게 전체 클래스가 아닌 필요한 메소드만 노출시켜 사용할 수 있도록 추상화를 잘 설계해야 한다.

### Bad

```ts
interface SmartPrinter {
  print();
  fax();
  scan();
}

class AllInOnePrinter implements SmartPrinter {
  print() {
    // ...
  }  
  
  fax() {
    // ...
  }

  scan() {
    // ...
  }
}

class EconomicPrinter implements SmartPrinter {
  print() {
    // ...
  }  
  
  fax() {
    throw new Error('Fax not supported.');
  }

  scan() {
    throw new Error('Scan not supported.');
  }
}
```

### Good

```ts
interface Printer {
  print();
}

interface Fax {
  fax();
}

interface Scanner {
  scan();
}

class AllInOnePrinter implements Printer, Fax, Scanner {
  print() {
    // ...
  }  
  
  fax() {
    // ...
  }

  scan() {
    // ...
  }
}

class EconomicPrinter implements Printer {
  print() {
    // ...
  }
}
```

## Dependency Inversion Principle (DIP)

의존성 역전 원칙은 두 가지 중요한 특징이 있다. 
1. 상위레벨 모듈은 하위 레벨 모듈에 의존해서는 안된다. 두 모듈 모두 추상적으로 의존해야 한다.
2. 추상화가 구체적이어서는 안된다. 구현이 추상화에 의존해야 한다.

의존성 역전 원칙에 따라 설계했을 시의 가장 큰 장점은 모듈간의 결합도(coupling)이 떨어진다는 점이다. DIP는 보통 IoC(Inversion of Control) 컨테이너를 사용하면 달성된다.

### Bad

```ts
import { readFile as readFileCb } from 'fs';
import { promisify } from 'util';

const readFile = promisify(readFileCb);

type ReportData = {
  // ..
}

class XmlFormatter {
  parse<T>(content: string): T {
    // Converts an XML string to an object T
  }
}

class ReportReader {

  // BAD: We have created a dependency on a specific request implementation.
  // We should just have ReportReader depend on a parse method: `parse`
  private readonly formatter = new XmlFormatter();

  async read(path: string): Promise<ReportData> {
    const text = await readFile(path, 'UTF8');
    return this.formatter.parse<ReportData>(text);
  }
}

// ...
const reader = new ReportReader();
const report = await reader.read('report.xml');
```

### Good

```ts
import { readFile as readFileCb } from 'fs';
import { promisify } from 'util';

const readFile = promisify(readFileCb);

type ReportData = {
  // ..
}

interface Formatter {
  parse<T>(content: string): T;
}

class XmlFormatter implements Formatter {
  parse<T>(content: string): T {
    // Converts an XML string to an object T
  }
}


class JsonFormatter implements Formatter {
  parse<T>(content: string): T {
    // Converts a JSON string to an object T
  }
}

class ReportReader {
  constructor(private readonly formatter: Formatter) {
  }

  async read(path: string): Promise<ReportData> {
    const text = await readFile(path, 'UTF8');
    return this.formatter.parse<ReportData>(text);
  }
}

// ...
const reader = new ReportReader(new XmlFormatter());
const report = await reader.read('report.xml');

// or if we had to read a json report
const reader = new ReportReader(new JsonFormatter());
const report = await reader.read('report.json');
```

## 참고

- [Clean Code Typescript](https://github.com/labs42io/clean-code-typescript#solid)
- [Javascript에서도 SOLID 원칙이 통할까](https://velog.io/@teo/Javascript%EC%97%90%EC%84%9C%EB%8F%84-SOLID-%EC%9B%90%EC%B9%99%EC%9D%B4-%ED%86%B5%ED%95%A0%EA%B9%8C)
