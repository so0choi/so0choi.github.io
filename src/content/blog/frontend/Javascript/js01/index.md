---
title: closer / curring
description: ':rotating light: 초보자를 위한 Node.js 200제 정리 내용 closer 클로저 클로저는 내부함수가 참조하는 외부함수의 지역변수 가, 외부함수가 리턴된 이후에도 유효성이 유지될 때 , 이 내부함수를 부르는 단어이다. 와 함수는 각자 지역변수를 가지고 있고 ( , ) 또다른 함수를 return 하고 있다…'
pubDate: 2020-09-21 14:41:15
tags:
  - Javascript
  - closer
  - curring
category: Javascript

---


:rotating_light: 초보자를 위한 Node.js 200제 정리 내용

# closer - 클로저

클로저는 **내부함수가 참조하는 외부함수의 지역변수**가, 외부함수가 리턴된 이후에도 **유효성이 유지될 때**, 이 내부함수를 부르는 단어이다.

```js
function grandParent(g1, g2) {
  const g3 = g1 + g2;
  return function parent(p1, p2) {
    const p3 = p1 + p2;
    return function child(c1, c2) {
      const c3 = c1 + c2;
      return g1 + g2 + g3 + p1 + p2 + p3 + c1 + c2 + c3;
    };
  };
}

const parentFunc = grandParent(1, 2);
const childFunc = parentFunc(11, 22);
console.log(childFunc(111, 222));

console.log(grandParent(1, 2)(11, 22)(111, 222));
```

`grandParent`와 `parent` 함수는 각자 지역변수를 가지고 있고 (`g3`, `p3`) 또다른 함수를 return 하고 있다. 이 함수들의 내부에 있는 `child`를 `클로저`라고 부르는데 내부에 있으며 외부 함수들이 이미 return 되었지만 외부 함수들의 지역 변수에 접근이 가능하고 정상적으로 모든 변수의 값을 더해 출력한다.

`parentFunc` 와 같은 이름으로 return된 각 함수를 초기화 할 수도 있고, 아래 처럼 괄호를 연속적으로 써서 사용할 수도 있다.

> 클로저는 Node.js 의 비동기 아키텍처에서 많이 사용되므로 확실히 이해해야 한다.

# curring - 커링

**커링**은 여러 개의 파라미터를 갖는 함수가 있을 때, 그 중 일부의 파라미터만 필요로 하는 함수를 만드는 기법을 말한다.
Node.js는 비동기 실행이 많기 때문에 return이 없는 대신 callback을 인자로 넘겨서 사용한다. 이때 커링 기법을 사용해 중복을 최소화 할 수 있다.

```js
const add = (a) => (b) => a + b;
const add10 = add(10);
console.log(add10(2));
console.log(add(10)(2));
```

화살표가 여러개로 이루어진 함수는 가장 아래줄 코드처럼 여러개의 인자를 넘겨줘야 한다. 하지만 화살표보다 적은 갯수의 인자를 넘기면, 해당 수로 앞에서 부터 변수를 초기화 시키고 나머지는 함수로 반환된다.
즉, 위 코드에서는 `const add10 = y => 10+y` 으로 반환된 것이다.
이런 상수 뿐만 아니라 자바스크립트에서는 함수도 넘겨줄 수 있다.

```js
const coffeeMachine = (liquid) => (espresso) => `${espresso}+${liquid}`;

const americanoMachine = coffeeMachine("Americano");
const latteMachine = coffeeMachine("Latte");

const americano = americanoMachine("Water");
const latte = latteMachine("Milk");

console.log(americano);
console.log(latte);
```

디자인패턴의 '데코레이터 패턴'과 유사한 느낌이다.

실제 프로젝트 개발 코드에서 어떻게 사용할 수 있을까?

```js
const fs = require("fs");

const openFileAndPrint = (path) => (fileName) =>
  fs.readFile(path + fileName, (err, data) => {
    if (err) throw err;
    console.log(data.toString());
  });

const thisDirOpenFileAndPrint = openFileAndPrint("./");
const otherDirOpenFileAndPrint = openFileAndPrint("../");

thisDirOpenFileAndPrint("test.txt");
```

이런식으로 `path`는 고정적인데 비해 `fileName`과 같은 가변적인 두가지 변수가 사용되는 경우 이런식으로 코드를 작성하면 `path`를 계속해서 중복되게 설정하는 수고를 덜 수 있다.
