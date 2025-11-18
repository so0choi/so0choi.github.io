---
title: ES6 문법
description: 'ES6 ES5에서 ES6로 넘어오면서 표준안이 생기게 되었고 많은 문법상 변화가 생겼다. 편리한 기능이 많이 추가되었고 최근에 나오는 많은 JS 문서의 코드들이 ES6 문법으로 쓰여진 경우를 많이 봤다. 기업에서도 ES6사용을 선호하고 있기 때문에 달라진 문법들을 잘 알아두는 것이 좋겠다. W3C ES6? 오래된 브라우…'
pubDate: 2020-09-18 23:13:55
tags:
  - Javascript
  - ES6
category: frontend




---


# ES6

ES5에서 ES6로 넘어오면서 표준안이 생기게 되었고 많은 문법상 변화가 생겼다. 편리한 기능이 많이 추가되었고 최근에 나오는 많은 JS 문서의 코드들이 ES6 문법으로 쓰여진 경우를 많이 봤다. 기업에서도 ES6사용을 선호하고 있기 때문에 달라진 문법들을 잘 알아두는 것이 좋겠다.
[W3C](https://www.w3schools.com/js/js_es6.asp)

## ES6?

> ES6 = ECMAScript 6
> ECMAScript란 Ecma International의 기술 규격에 정의된 표준화된 Script Programming 언어이다. JS를 표준화하기 위해 만들어졌다. 표준안이 새로 만들어질 때 마다 버젼 정보가 뒤에 숫자로 붙는데, 2009년에 만들어진 ES5가 가장 보편적이다. 그리고 2015년 ES6가 나오게 되는데 이때 코드의 효율성을 높여줄 신기술이 굉장히 많이 도입되었다. 문법을 제대로 공부하지 않으면 코드를 읽을 수 없을 정도이다.

오래된 브라우저들은 최신 문법을 지원하지 않는 경우도 있는데, 이럴 경우 [babel](https://babeljs.io/) 같은 사이트를 이용해 예전 문법으로 코드를 전환시키는 방법도 있다. (babel website 이외에도 'babel-cli'를 사용할 수도 있다.)

ES6에서 새로 추가된 문법이다. Java와 같은 객체 지향 언어에서 사용되고 있었는데, 이제 JS 에서도 그에 준하는 `class`를 사용해 OOP를 구현할 수 있게 되었다.

## 몇 가지 기능들

### Class

```js
class Robot {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} speak`);
  }
}

const robot = new Robot("BABO");
robot.speak();
```

타 언어들과 비슷한 방식으로 사용한다. `class` 키워드를 사용해 선언할 수 있고 `{}` 연산자를 사용해 그 안에 클래스의 구성요소들을 작성한다.

`constructor`는 이름 그대로 생성자이다. 클래스를 생성하는 순간 실행되기 떄문에 클래스의 초기 세팅을 여기서 할 수 있다.

그 아래에 나오는 `()`로 선언되는 것들은 클래스 인스턴스가 사용할 수 있는 메서드를 정의하는 것이다.

`new` 키워드를 사용해 새로운 클래스를 생성하고 클래스의 메서드는 `.`로 호출해 사용한다.

#### extends

단어의 뜻 그대로 `상속`이라는 개념이다. 다른 클래스를 상속받으면, 이전에 선언한 클래스의 요소들을 모두 사용할 수 있다.

```js
class AI extends Robot {
  constructor(name) {
    super(name);
  }
  walk() {
    console.log(`${this.name} walk`);
  }
}
const ai = new AI("BABO");
ai.speak();
ai.walk();
```

`speak()`는 위에 작성한 `Robot` 클래스에 작성된 메서드이며 새로운 `AI` 클래스에는 선언되지 않았다. 하지만 `AI` 클래스의 인스턴스 `ai`는 부모의 메서드 `speak()`와 자신의 메서드 `walk()`를 모두 사용이 가능하다.

코드의 재사용성을 높이는 것은 정말 중요하다. 따라서 `extends`를 잘 사용하는 것 또한 실력인 것 같다.

#### static method

클래스 내부에 선언된 `static` 메소드는 클래스를 `new`로 생성하지 않아도 사용할 수 있다. 생성자를 통해 생성되는 방식이 아니기 때문이다.

```js
"use strict";

class Robot {
  constructor(name) {
    this.name = name;
  }
  static speak() {
    console.log("speak");
  }
}

Robot.speak(); //speak
```

이처럼 `Robot` 클래스의 인스턴스를 생성하지 않고도 바로 호출해서 사용할 수 있다.

따라서 `static` 함수만 존재하는 클래스는 `constructor`가 의미를 가지지 않는다.

### every

Array.prototype.every 로 정의된 메서드이다. 인자로 `callback function`을 받는다. 배열의 원소들이 `key`로 설정한 특정 조건을 모두 만족하는지에 따라 `boolean` 타입으로 결과를 반환한다.

```js
arr = [1, 2, 3];
console.log(arr.every((key) => key < 4)); // true
```

### 변수 선언

`var`의 한계점을 극복하기 위해 만들어진 변수 선언 방식이다.
`var`의 문제점 중 하나는 function scope를 가진 다는 점이다. 또한 같은 이름의 변수를 `var`로 재선언 해도 에러가 발생하지 않는다. 이런 점들을 해결하기 위해 나온 것이 아래 두 변수 선언 방식들이다.

- `const` : 변하지 않는 상수. 재지정 불가
- `let` : 지역 변수. 재선언이 불가능하다. 블럭(`{}`) 단위이다.

### 변수 할당

```js
a = 1;
b = 2;
c = 3;

a, b, (c = [1, 2, 3]);
```

아래 방식으로 줄여서 사용할 수 있게 되었다.

### Arrow function

간단하게 `=>`를 사용해 함수를 선언할 수 있는 문법이다.

```js
const func1 = function (a, b) {
  return a + b;
};
const func2 = (a, b) => a + b;
```

두 함수는 같은 동작을 한다.

```js
// Expression bodies
var odds = evens.map((v) => v + 1);
var nums = evens.map((v, i) => v + i);
var pairs = evens.map((v) => ({ even: v, odd: v + 1 }));

// Statement bodies
nums.forEach((v) => {
  if (v % 5 === 0) fives.push(v);
});
```

다양한 문맥에서 깔끔하게 함수를 선언할 수 있다.

### spread 연산자

```js
const arr1 = [1, 2];
const arr2 = [3, 4, 5];
const arr = [...arr1, ...arr2];
```

`[]`로 nested 된 Array속 인자들이 spread되어 `arr` 내부에 추가된다.
가변적인 인자를 받을 때 효율적으로 사용할 수 있다.

```js
function f(a, ...b) {
  console.log(b[0]);
}
f("nodejs", "heool", 1);
```

결과

```
heool
```

이렇게 b에 몇 개의 인자가 올 지 알 수 없음에도 불구하고 원하는 값을 출력할 수 있다.

### Template Strings

매우 간단한 방법으로 문자열에 변수를 추가하는 기능이다. ````을 사용한다.

```js
var num = 4;
console.log("Num is", num);

console.log(`Num is ${num}`);
```

이 외에도 여러가지가 있다.

## 참고

[ES6 Features README.md](https://github.com/so0choi/es6features)
