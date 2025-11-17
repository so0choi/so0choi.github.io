---
title: "[Node.js] Module Pattern"
description: 'Module Pattern 모든 코드를 App.js 에 몰아넣기 보다는 기능에 맞게 모듈화 하여 분리해 관리하는 것이 전체 프로젝트를 관리하기에 훨 씬 좋다. 모듈화 작업은 나중에 리팩토링 하려 하지 말고 처음부터 잡아놓는 것이 좋은 것 같다. 이후에 하려고 하면 복잡하다. Node.js의 standard 모듈화 방법은…'
pubDate: 2020-08-29 01:40:00
tags:
  - Node.js
  - Javascript
category: Node.js

---


# Module Pattern

모든 코드를 App.js 에 몰아넣기 보다는 기능에 맞게 모듈화 하여 분리해 관리하는 것이 전체 프로젝트를 관리하기에 훨-씬 좋다. 모듈화 작업은 나중에 리팩토링 하려 하지 말고 처음부터 잡아놓는 것이 좋은 것 같다. 이후에 하려고 하면 복잡하다.

Node.js의 standard 모듈화 방법은 **CommonJS**를 사용하고 있다. 여기서 정의하는 모듈화 방식은 다음과 같다.

- scope : 모든 모듈은 자신만의 독립적인 실행 영역이 있어야 한다.
- definition : 모듈의 정의는 exports 객체를 이용한다.
- usage : 모듈의 사용은 require 함수를 이용한다.

즉 모듈을 내보내는데는 `exports` 또는 `module.exports`를 사용한다.
내보낸 모듈을 다른 파일에서 사용하기 위해서 `require()` 메소드를 호출한다. `require()`는 exports 객체를 반환한다. 따라서 이를 할당한 변수에서는 exports 객체 내부에 정의했던 함수나 객체를 사용할 수 있게 된다.

## exports vs module.exports

`exports` 전역 변수는 어디에서나 접근할 수 있게 정의된 것이다. 새로운 파일을 만들고 그 안에서 exports 전역 변수에 속성을 추가하면 다른 파일에서도 exports 전역 변수의 속성을 참조할 수 있다.

Node.js에서 require를 쓰면 항상 `module.exports`를 반환한다. 즉 이 둘이 함께 쓰이는 것은 Node.js가 CommonJS를 따르지만 결과적으로는 `require`가 `module.exports`를 반환하기 때문이다.
`module.exports`는 `exports`와 같은 객체를 가리킨다. `exports`는 사실 `module.exports`를 가리키는 shortcut 역할을 하고 있다.
하지만 이 두가지가 혼용될 경우, `module.exports`가 더 우선권을 가지고 `exports`에 할당한 내용은 무시되어진다.

```js
module.exports = { a: "A" };
exports.b = "B";
console.log(exports === module.exports); // false
console.log(module); // Module { exports: { a:'A'}}
```

### 객체 자체를 할당하기

`exports` 전역 변수를 이용할 수 있는 경우는 `exports` 에 새로운 속성을 생성하고 이를 사용하는 경우이다. `exports` 자체에 새로운 객체를 할당하게 되면 자바스크립트는 이를 전역변수가 아닌 **지역변수**로 인식하고 결국 `require` 하려고 해도, 빈 객체가 반환되고 사용할 수 없게 된다.

'module1'

```js
exports = {
  getUser: function () {
    return { id: "test1", name: "test user" };
  },
};
```

'app.js'

```js
const m1 = require("./module1");
console.log(m1.getUser()); //TypeError: m1.getUser is not a function
```

하지만 `module.exports`를 사용할 경우 객체 자체를 할당해도 다른 파일에서 해당 모듈을 불러와 정상적으로 사용할 수 있다.

'module1.js'

```js
module.exports = {
  getUser: function () {
    return { id: "test1", name: "test user" };
  },
};
```

'app.js'

```js
const m1 = require("./module1");

console.log(m1.getUser()); //{ id: 'test1', name: 'test user' }
```

즉, `exports`에 객체를 그대로 할당하면 다른 파일에서 해당 객체를 참조할 수 없지만, `module.exports`에 객체를 그대로 할당하면 모듈 파일 내부에서 할당한 객체를 참조할 수 있다.

## 문법

### module.exports.func

모듈 파일은 내보내기 위한 함수 또는 변수를 `exports`를 사용해 다른 파일에서 사용하도록 할 수 있다.

```js
const a = "hello I'm module";
module.exports.a = a;
```

`exports`한 모듈을 읽기 위해서 다른 js 파일에서는 `import`를 사용해 읽을 수 있다.

```js
const myvar = require("./myvar");
console.log(myvar.a);
```

출력 결과

```
hello I'm module
```

함수를 내보낸 경우, 실제 함수처럼 뒤에 `()`를 붙여서 사용할 수 있다.

myvar.js

```js
module.exports.a = function (a, b) {
  return a + b;
};
```

index.js

```js
const myvar = require("./myvar");
console.log(myvar.a(1, 2));
```

출력 결과

```
3
```

### module.exports

module.export로 내보내야 할 요소가 한가지 뿐이라면 `module.exports = something` 이런식으로 바로 내보낼 수 있다.

```js
function edit() {}
function write() {}
```

이렇게 두가지 함수가 있을 때 두 함수를 하나의 객체로 exports 하는 경우 다음과 같이 작성할 수 있다.

```js
module.exports = {
  edit,
  write,
};
```

여기서 import 된 파일에서 각 함수를 사용할 이름과 함수의 본래 이름을 같게 사용할 것이라면 위 코드처럼 원 함수명만 써주면 된다. (즉 `'edit' = edit` 와 같은 의미)

또는 한가지 함수만 내보내고 싶은 경우 다음과 같이 작성한다.

```js
module.exports = write;
```

함수 뿐만이 아니라 클래스도 exports가 가능하다. 그 외에 config 데이터들도 내보낼 수 있기 때문에 많이 사용되는 기능이다.

## 다른 모듈 설치 & 적용

다른 사람이 만든 모듈도 패키지 매니저(npm등)를 사용해 얼마든지 다운받아 사용할 수 있다. 명심해야 할 점은 사용자가 만든 모듈과 달리 path를 명시하지 않아도 된다는 점이다.

```js
const express = require("express");
```

`express` 모듈을 설치 후 불러와서 사용하는 코드이다. path를 지정하지 않고 있다.

## Reference

[exports vs module.exports](https://www.hacksparrow.com/nodejs/exports-vs-module-exports.html)
[module.exports vs exports in Node.js](https://stackoverflow.com/questions/7137397/module-exports-vs-exports-in-node-js#:~:text=exports%3Dexports%20%2C%20and%20the%20require%20function%20returns%20the%20object%20module.&text=exports%20refer%20to%20the%20original,refer%20to%20the%20new%20object.)
[JavaScript 표준을 위한 움직임: CommonJS와 AMD](https://d2.naver.com/helloworld/12864)
