---
title: "JavaScript apply vs bind vs call"
description: "JavaScript의 세 함수 apply, bind, call을 비교해 보자."
pubDate: 2026-04-09 16:42:19
category: javascript

---

JavaScript의 세 함수를 비교해 보자.

자바스크립트에서 모든 것은 객체다. 함수도 마찬가지이다. apply, bind, call은 Function 프로토타입에 정의된 인스턴스 메서드이다. 세 메서드는 비슷하지만 다르게 동작한다. 하나하나 정리해 보자.

## arguments

함수로 들어가기 전에 미리 알아두면 좋은 개념이다. arguments는 함수가 호출되면 JS 엔진이 알아서 만들어주는 객체이다.

```js
function test(){
    console.log(arguments)
}

test(1,2,3);
// Arguments(3) {
//     "0": 1,
//     "1": 2,
//     "2": 3
// }, callee, length
```

arguments는 array는 아니고 array-like 형태이다. 주의할 점은 arrow function에는 arguments가 없다는 점이다.

```js
// arguments는 배열이 아니므로 Array 메서드를 직접 사용할 수 없다.
arguments.map(x => x) // Error

// 화살표 함수에는 자체 arguments가 없다   
const func = () => {
    console.log(arguments) // Error
}
```

엔진 내부 관점으로 보면 함수 호출 시 내부에서 발생하는 동작은 다음과 같다.

1. 실행 컨텍스트 생성
2. 파라미터 바인딩
3. arguments 객체 생성

함수 내부 동작을 위한 보조 객체로써 사용된다고 보면 되겠다.

## Call 

> [MDN 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

함수를 호출하는 메서드이다. 주어진 `this`와 함께 전달된 인수로 함수를 호출한다.

### 구문

```js
func.call(thisArg[, arg1[, arg2[, ...]]])
```

- thisArg: 함수 호출에 제공될 this의 값
- arg: 함수 호출에 제공될 매개변수들

### 사용 예

```js
function Product(name, price){
    this.name = name;
    this.price = price;
}

function Food(name, price){
    Product.call(this, name, price);
    this.category = 'food';
}

console.log(new Food('cheese', 5).name); // cheese
```

Product.call에서 첫 번째 인자로 this를 넘김으로써 Food 객체가 전달된다. 따라서 호출된 함수에서 this는 Food 객체가 된다.
이처럼 call()은 이미 다른 객체에 할당되어있는 함수나 메소드를, 이를 호출하는 객체에 재할당할 때 사용된다. 새 객체를 위해 메소드를 재작성하지 않아도 call()을 사용해 다른 객체에 상속할 수 있다.

```js
var sData = "Wisen";
function display() {
  console.log("sData value is %s ", this.sData);
}

display.call(); // sData value is Wisen

console.log(this) // Window
```

첫 번째 인수는 필수값이 아니며, 지정하지 않으면 this의 값은 전역 객체로 바인딩된다. 브라우저에서 this는 Window 객체를 가리킨다. (strict 모드에서는 전역 this가 undefined로 대체된다.) Node.js 환경에서는 undefined로 실행될 것이다.

## apply

> [MDN 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

apply는 call 구문과 유사하다. 하나의 차이점은 call은 인수를 리스트 형태로 받고, apply는 단일 배열을 받는다는 점이다.

### 구문

```js
func.apply(thisArg, [argsArray])
```

- thisArg: func를 호출하는데 제공될 this의 값
- argsArray: func에 호출되어야 하는 인수가 담긴 유사 배열 객체

### 사용 예

배열에 배열을 붙이는데 apply를 사용할 수 있다. concat을 사용하면 되지 않냐고 할 수 있는데, concat은 아이템을 붙여 새 배열을 반환하는 반면 apply를 사용하면 기준 배열에 아이템을 추가만 할 수도 있다.

```js
var array = ["a", "b"];
var elements = [0, 1, 2];
array.push.apply(array, elements);
console.info(array); // ["a", "b", 0, 1, 2]
```

하지만 요즘 기준으로는 성능과 안정성 측면에서 concat이나 `array.push(...elements)`의 사용이 권장된다. 아래에서도 언급하지만 자바스크립트 함수 인자 개수 제한이 있다는 것이 가장 큰 문제이다. 
또 v8은 배열 연산 최적화를 수행하는데 apply를 사용하면 인자 개수를 예측할 수 없고 타입도 모르기 때문에 내부 최적화가 불가능해진다. 또한 인자로 들어온 배열의 아이템을 죄다 펼쳐놓기때문에 메모리 부담도 높아진다. 이에 반해 spread 연산자는 엔진 최적화가 가능해 조금 더 안정성이 올라간다.  

apply를 잘 사용하면 배열과 루프 없이 간단하게 처리되는 작업들이 있다. 예를 들어 Math.min은 전달받은 인자들을 비교해 최소값을 반환하는데, apply 없이 구현하려고 하면 loop가 필요하다. 하지만 apply를 사용하면 추가 배열 없이도 구현이 가능하다.

```js
const numbers = [1,2,3,4,5];

const min = Math.min.apply(null, numbers)
const max = Math.max.apply(null, numbers)

console.log(min) // 1
console.log(max) // 5
```

현대 JS에서는 spread operator가 나타난 뒤로 apply 대신 `...` 문법이 더 자주 사용된다.

```js
Math.max(...numbers)
```

> 자바스크립트의 인수 개수 제한은 엔진마다 다르지만 일반적으로 수만 개 수준이며 V8 기준으로 65536개 이므로 인수의 수를 알 수 없는 경우 상한을 넘지 않도록 하는 안전 장치가 필요하다. 

## bind

> [MDN 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

bind()는 새로운 함수를 생성하는 메소드이다. 첫 인자로 `this`를 설정할 수 있고 그 다음 인자들은 바인드된 함수 인수로 전달된다. binding한 함수는 원본 함수 객체를 감싸는 함수로 바인딩한 함수를 호출하면 래핑된 내부 함수가 호출된다. 

```js
const module = {
  x: 42,
  getX: function () {
    return this.x;
  },
};

const unboundGetX = module.getX; // 원본 객체와의 연결은 손실된다.
console.log(unboundGetX()); // 함수의 this는 전역 scope로 실행된다. 
// Expected output: undefined

const boundGetX = unboundGetX.bind(module);
console.log(boundGetX());
// Expected output: 42
```

module에서 가져온 getX 함수인데 왜 this가 전역으로 설정되는지 이해가 되지 않을 수 있다. 이렇게 동작하는 이유는 `this`가 함수가 어디서 선언됐는지가 아닌 어떻게 호출되었는지로 결정되기 때문이다. 즉, 호출되는 순간의 호출 방식에 의해 결정된다.

bind를 사용하면 초기 인수가 있는 함수를 만들 수 있다.

```js
function list() {
  return Array.prototype.slice.call(arguments);
}

var leadingThirtysevenList = list.bind(null, 37);

var list2 = leadingThirtysevenList(); // [37]

var list3 = leadingThirtysevenList(1, 2, 3); // [37, 1, 2, 3]
```

slice는 인자가 없으면 this로 받은 객체 아이템을 shallow copy한 Array를 반환한다. 위에서 알아봤던 call을 사용해 list의 arguments를 this로 전달하면 해당 array like arguments 값들이 배열 형태로 반환되는 것이다. 여기에 bind를 사용해 래핑 함수를 생성하면 항상 37이 첫 번째 인자로 들어가있는 함수를 만들 수 있다.


## 정리


|   | call| apply | bind|
| ---| --| --|--|
|즉시 호출 |O | O | X (새 함수 반환|
| 인수 전달| 개별 나열 | 배열 | 개별 나열 |
|반환값 | 함수 실행 결과| 함수 실행 결과| 바인딩된 새 함수|

apply와 call은 사실 현대 자바스크립트의 spread 연산자가 나온 뒤로 잘 사용되지 않는 내용이 많다. 하지만 아직도 레거시 코드 자료에서 심심치 않게 보이고, 자바스크립트 엔진 내부 동작을 제대로 이해하고 코드를 보는 것과 그렇지 않은 것에는 차이가 있을 것이라 생각된다. 또한 bind는 여전히 이벤트 핸들러나 부분 적용을 위해 많이 사용된다. 
