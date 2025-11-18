---
title: Hoisting
description: 'Hoisting Hoisting이란 선언되기 전에 호출한 변수나 함수를 사용하더라도 JS 특성상 사용이 가능한 특징이다. 출력 선언되기도 전에 사용한 변수가 정상적으로 불러와짐으로 인해서 개발자에게 혼란을 가져왔는데, 주로 키워드를 사용할 때 이러한 문제들이 발생했다. 이런 문제점들은 을 사용하면 해결할 수 있다. 키워…'
pubDate: 2020-09-13 21:42:22
tags:
  - Javascript
category: frontend





---



Hoisting이란 선언되기 전에 호출한 변수나 함수를 사용하더라도 JS 특성상 사용이 가능한 특징이다.

```js
a = "HEY";
console.log(a);
var a;
```

출력

```
HEY
```

선언되기도 전에 사용한 변수가 정상적으로 불러와짐으로 인해서 개발자에게 혼란을 가져왔는데, 주로 `var` 키워드를 사용할 때 이러한 문제들이 발생했다.

이런 문제점들은 `let`을 사용하면 해결할 수 있다.

`let` 키워드는 선언된 후에만 사용할 수 있기 때문에 사용하려고 하면 문법적 오류가 발생해 로직 오류를 방지할 수 있다.

```js
a = "HEY";
console.log(a);
let a;
```

출력

```
1.js:1 Uncaught ReferenceError: Cannot access 'a' before initialization
    at 1.js:1
```
