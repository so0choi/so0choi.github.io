---
title: Javascript 30 - Day 7
description: 'Javascript30 Day7 Array Cardio Day 2 Array 자료형의 유용한 메서드를 공부한다. test data는 아래와 같다. Array.prototype.some() function을 인자로 받아 조건을 만족하는 원소가 Array에 적어도 하나 있는지를 bool 형식으로 반환한다. Is at lea…'
pubDate: 2020-08-20 22:40:34
tags:
  - Javascript
  - Javascript30
category: Javascript

---

## Javascript30 Day7 - Array Cardio Day 2
Array 자료형의 유용한 메서드를 공부한다.
test data는 아래와 같다.
```js
const people = [
        { name: "Wes", year: 1988 },
        { name: "Kait", year: 1986 },
        { name: "Irv", year: 1970 },
        { name: "Lux", year: 2015 },
      ];

      const comments = [
        { text: "Love this!", id: 523423 },
        { text: "Super good", id: 823423 },
        { text: "You are the best", id: 2039842 },
        { text: "Ramen is my fav food ever", id: 123523 },
        { text: "Nice Nice Nice!", id: 542328 },
      ];
```

## Array.prototype.some()
function을 인자로 받아 조건을 만족하는 원소가 Array에 적어도 하나 있는지를 bool 형식으로 반환한다.
- Is at least one person 19 or older?
```js
const isAdult = people.some(function (person) {
        const currentYear = new Date().getFullYear();
        if (currentYear - person.year >= 19) return true;
      });
console.log(isAdult);
```

Arrow function을 사용하면 다음과 같이 간단하게 나타낼수 있다.
```js
const isAdult = people.some(
        (person) => new Date().getFullYear() - person.year >= 19
      );
```

## Array.prototype.every()
function을 인자로 받아 Array의 모든 원소가 조건을 만족하는지 여부를 bool로 반환한다.

- Is everyone 19 or older?

```js
const allAdult = people.every(
        (person) => new Date().getFullYear() - person.year >= 19
      );
console.log(allAdult);
```

## Array.prototype.find()
원하는 값을 찾을 때 사용한다. filter() 메서드와 비슷하지만 find는 찾고자 하는 조건에 부합하는 단 하나의 element를 반환한다.

- find the comment with the ID of 823423
```js
const findId = comments.find((comment) => comment.id === 823423);
console.log(findId);
```

## Array.prototype.findIndex()
원하는 값의 Array내 인덱스를 찾을 때 사용한다. 
-  `Array.prototype.splice()`
함수와 함께 사용할 수 있다. `splice`는 Array 객체에 원하는 위치에 element를 추가하거나 삭제하는 메서드다.

## Array.prototype.splice()
[공식 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
- 문법
`splice(start[, delete_count, item])` 
- `start` : Array에서 변화를 줄 시작 인덱스
- `delete_count` : `start` 인덱스에서 시작해 배열에서 지울 element의 갯수
만약 `0`이거나 음수라면 아무 요소도 지워지지 않는다.
- `item` : `start` 인덱스부터 배열에 새로 채워질 item

- Find the comment with ID of 823423 and delete the comment
```js
const index = comments.findIndex((comment) => comment.id === 823423);
comments.splice(index, 1);
```
찾고자 했던 ID 값에 해당하는 `comment`의 index를 찾아 `splice`메소드를 이용해 해당 index부터 한 개의 element를 삭제한다.

### Array.prototype.slice()
[공식 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
배열을 슬라이싱하는 메서드이다. 
- 문법
`Array.slice(start[, end])`

위의 문제를 `slice()`를 이용해서 풀 수 있다.
```js
const newComments = [
    ...comments.slice(0,index)
    ...comments.slice(index+1)
];
```
`end` index의 요소는 포함하지 않기 때문에 `index`의 요소는 삭제 된 새로운 Array 가 `newComments`에 들어간다. `...` 키워드를 사용하지 않으면 nested 되므로 주의하자.

