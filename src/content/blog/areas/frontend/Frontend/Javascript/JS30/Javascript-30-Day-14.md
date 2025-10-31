---
title: Javascript 30 Day 14
description: 'Day 14 Javascript References vs Copying value copy & reference copy 어느 프로그래밍 언어를 공부해도 공통적으로 들어있는 내용이 있다. 얕은 복사(shallow copy)와 깊은 복사(deep copy)이다. 보통 변수 값을 복사하면 변수가 가진 value가 복사되는…'
pubDate: 2020-08-30 14:54:38
tags:
  - Javascript
  - Javascript30
category: Javascript

---


# Day 14 - Javascript References vs Copying

## value copy & reference copy

어느 프로그래밍 언어를 공부해도 공통적으로 들어있는 내용이 있다. 얕은 복사(shallow copy)와 깊은 복사(deep copy)이다.
보통 변수 값을 복사하면 변수가 가진 value가 복사되는 것을 **얕은 복사**라 하고, 변수안에 들어있는 값이 아닌 변수가 가리키는 주소값의 복사되는 것을 **깊은 복사**라 한다.
두 복사 동작의 원리의 차이점을 제대로 알지 못하면 오류가 발생해도 이를 찾아내기가 쉽지 않다. 따라서 정확히 구분할 필요가있다.

```js
let age = 100
let age2 = age
console.log(age, age2)
// 100 100
age = 200
console.log(age, age2)
200 100

const players = ['Wes','Sarah', 'Ryan', 'Poppy']
const team = players
console.log(players)
console.log(team)
// ['Wes','Sarah', 'Ryan', 'Poppy']
// ['Wes','Sarah', 'Ryan', 'Poppy']
team[3] = 'Lux'
console.log(players)
console.log(team)
// ['Wes','Sarah', 'Ryan', 'Lux']
// ['Wes','Sarah', 'Ryan', 'Lux']
```

위 예제를 실행해보면 주석과 같은 결과가 나온다. `team` 변수에 `players` 배열 이름을 복사했기 때문에 Array의 주소가 복사 된 것이다. 따라서 복사 한 개체에서 배열의 값을 변경할 경우 본래 배열이 가리키는 주소 또한 같은 배열을 가리키고 있기 때문에 그 값을 출력했을 때 변경된 값으로 확인되는 것이다.

## 해결책 1 - slice()

`Array.prototype.slice([start, end])` 는 `start`부터 `end` 까지의 원소를 value copy 하여 Array로 반환하는 메서드이다. 이때 인자를 아무것도 넘기지 않으면 배열 전체를 복사해 새로운 배열을 만들어 반환한다. 이것은 완전히 새로운 주소를 가지는 original Array와는 다른 배열이기 때문에 두 리스트는 따로 존재하게 된다.

```js
const team2 = players.slice();
team2[0] = "Soyeong";
console.log(players, team2);
// ['Wes','Sarah', 'Ryan', 'Lux']
// ['Soyeong','Sarah', 'Ryan', 'Lux']
```

## 해결책 2 - concat()

`Array.prototype.concat()` 메서드는 `Arr1.concat(Arr2)` 의 형태로 사용되는데, 두 배열의 원소들을 합친 새로운 배열을 반환한다. 새로운 주소를 가지는 배열이기 때문에 original Array와 관계가 없다.

```js
const team3 = [].concat(players);
team3[0] = "HI";
console.log(players, team3);
// ['Wes','Sarah', 'Ryan', 'Lux']
// ['HI','Sarah', 'Ryan', 'Lux']
```

## 해결책 3 - ES6 방식

### spread 연산자

ES6에 추가된 새로운 기능인 `spread`를 사용할 수 있다. `spread`는 `...` 연산자로 사용하며 nested된 배열의 원소들을 풀어 낸다. 풀어낸 원소들을 새로운 배열에 집어넣으면 똑같은 원소를 가지는 새로운 배열을 만들어낼 수 있다.

```js
const team4 = [...players];
team4[0] = "ES6";
console.log(players, team4);
// ['Wes','Sarah', 'Ryan', 'Lux']
// ['ES6','Sarah', 'Ryan', 'Lux']
```

### Array.from()

ES6에 추가된 기능이다. `Array.from()` 은 배열로 부터 shallow copy를 수행한 새로운 배열을 반환한다. 우리가 하고자 하는 작업과 가장 메서드의 생성 의미가 같다고 할 수 있다.

```js
const team5 = Array.from(players);
team5[0] = "from";
console.log(players, team5);
// ['Wes','Sarah', 'Ryan', 'Lux']
// ['from','Sarah', 'Ryan', 'Lux']
```

## Object Copy

객체를 복사할 때 original object의 이름을 넘겨주면 deep copy가 수행된다. 이를 원치 않는다면 다른 방식을 적용해야 한다.

### Object.assign()

`Object.assign({}, target_arr [,{ new valuables}])` 로 사용한다. `target_arr` object에서 shallow copy한 새로운 Object를 반환한다. 이때 `new_valueables`에 값을 입력할 수도 있는데, original 객체의 속성 값을 변경할 수도 있고 새로운 속성을 추가할 수도 있다.

```js
const wes = {
  name: "Wes",
  age: 100,
  social: {
    twitter: "@abc",
    facebook: "weswes",
  },
};
const dev = Object.assign({}, wes);
dev.name = "Sy";
console.log(wes, dev);
```

```bash
# 출력
wes = {
        name:'Wes',
        age: 100,
        social: {
          twitter: '@abc',
          facebook: 'weswes'
        }
      }
dev = {
        name:'Sy',
        age: 100,
        social: {
          twitter: '@abc',
          facebook: 'weswes'
        }
      }
```

얼핏 보면 잘 된 것 같아 보인다. 하지만 `Object.assign()`은 `one level copy`를 수행한다. 즉, 한번 더 nested된 내부 객체 `social`을 변경할 경우, original object의 값도 변경된다는 것이다.

내부 레벨까지의 deep copy가 필요한 경우 다음과 같은 조치를 취할 수 있다. 하지만 많은 경우 이런 작업은 필요없기 때문에, 이것이 꼭 필요한 작업인지 고민해보고 구현하도록 한다.

### Deeeep level Object Copy

> `JSON.parse(JSON.stringify(Object))`
> 간단한 꼼수이다. target 객체를 문자열화 한 다음, 이를 다시 JSON으로 parsing 시키면 새로운 객체를 반환하게 된다. 이를 다른 변수에 넣어주면 original 객체와 완전히 같은 값을 가지는 다른 객체를 만들수 있다.

```js
const dev2 = JSON.parse(JSON.stringify(wes));
dev2.social.twitter = "@HAPPYHAPPY";

console.log(wes.social, dev2.social);
```
