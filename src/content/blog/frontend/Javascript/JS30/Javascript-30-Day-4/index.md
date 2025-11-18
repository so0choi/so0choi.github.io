---
title: Javascript 30 - Day 4
description: 'Javascript30 Day4 Array Cardio Day 1 Array 자료형에 내장된 여러 유용한 함수들을 사용하면, 일반 반복문으로 해결하던 작업들을 더 간단하게 수행할 수 있기 때문에 잘 활용하는게 좋다. 예제 Data 1. Array.proottype.filter() 지정된 filter function 조건…'
pubDate: 2020-08-16 15:40:58
tags:
  - Javascript
  - Javascript30
category: frontend




---

## Javascript30 Day4 - Array Cardio Day 1
Array 자료형에 내장된 여러 유용한 함수들을 사용하면, 일반 반복문으로 해결하던 작업들을 더 간단하게 수행할 수 있기 때문에 잘 활용하는게 좋다.

### 예제 Data
```js
const inventors = [
      { first: 'Albert', last: 'Einstein', year: 1879, passed: 1955 },
      { first: 'Isaac', last: 'Newton', year: 1643, passed: 1727 },
      { first: 'Galileo', last: 'Galilei', year: 1564, passed: 1642 },
      { first: 'Marie', last: 'Curie', year: 1867, passed: 1934 },
      { first: 'Johannes', last: 'Kepler', year: 1571, passed: 1630 },
      { first: 'Nicolaus', last: 'Copernicus', year: 1473, passed: 1543 },
      { first: 'Max', last: 'Planck', year: 1858, passed: 1947 },
      { first: 'Katherine', last: 'Blodgett', year: 1898, passed: 1979 },
      { first: 'Ada', last: 'Lovelace', year: 1815, passed: 1852 },
      { first: 'Sarah E.', last: 'Goode', year: 1855, passed: 1905 },
      { first: 'Lise', last: 'Meitner', year: 1878, passed: 1968 },
      { first: 'Hanna', last: 'Hammarström', year: 1829, passed: 1909 }
    ];
```

### 1. Array.proottype.filter()
지정된 filter function 조건을 부합하는 element만을 포함한 새로운 Array를 반환한다.

- Filter the list of inventors for those who were born in the 1500's
```js
const fiftiesPeople = inventors.filter(inventor => 1500 <= inventor.year && inventor.year < 1600)
console.log(fiftiesPeople);
```

### 2. Array.prototype.map()
Array의 모든 element에 대해 주어진 function을 취한 값을 가지는 새로운 Array를 반환한다.

- Give us an array of the inventors first and last names
```js
const nameMap = inventors.map(inventor => inventor.first + ' '+inventor.last);
//또는
const nameMap2 = inventors.map(inventor => `${inventor.first} ${inventor.last}`);
console.log(nameMap);
```

#### map & filter
두 메서드는 함께 사용되는 경우가 많다.
- create a list of Boulevards in Paris that contain 'de' anywhere in the name
[위키피디아 링크](https://en.wikipedia.org/wiki/Category:Boulevards_in_Paris)
```js
const category = document.querySelector('.mw-categories');
const links = Array.from(category.querySelectorAll('a'));
const de = links
            .map(link=> link.textContent)
            .filter(streetName => streetName.includes('de'));
```
여기서 주의할 점은, `querySelectorAll()`의 반환값으로 NodeList가 반환되고 NodeList에는 map 메서드가 없다. 따라서 이를 `Array.from()`을 사용해 Array로 변환한 후에 map, filter 작업을 해준 것이다.

Array로 변환하는 방법은 `Array.from()` 외에도 `[]`로 감싸주는 것만으로도 가능하다.

### 3. Array.prototype.sort()
지정한 함수에 따라 Array element들을 정렬하거나 반환한다.
- Sort the inventors by birthdate, oldest to youngest.
```js
inventors.sort((a,b)=>(a.year-b.year))
//또는
const ordered = inventors.sort((a,b)=>(a.year> b.year? 1 : -1));
console.log(inventors);
```
- Sort the inventors by years lived = *역순 정렬*
```js
yearOrdered = inventors.sort((a,b)=>((b.passed-b.year) - (a.passed-a.year) ))
console.table(yearOrdered);
```

### 4. Array.prototype.reduce()
지정한 함수에 따라 Array element들에 적용하여 하나의 result를 반환한다.
예를 들어 Array의 모든 값들을 더할 때 사용할 수 있다.
- How many years did all the inventors live all together?
```js
const totalYears = inventors.reduce((total, inventor) => {
      console.log(total);
      return total + (inventor.passed - inventor.year);
}, 0) //0 is initial value, 초기화 시키지 않으면 오류 발생
console.log(totalYears);
```
- Sum up the instances of each of these example data
#### Example Data

```js
const data = ['car', 'car', 'truck', 'truck', 'bike', 'walk', 'car', 'van', 'bike', 'walk', 'car', 'van', 'car', 'truck' ];
```

```js
const sumData = data.reduce((obj, item)=> {
      if (!obj[item]) {
        obj[item] = 0
      }
      obj[item]++;
      return obj;
    },{});
console.log(sumData);
```
data에 있는 element를 하나씩 순회하면서 obj에 해당 item이 key 값으로 존재하는지 확인 후 없는 경우 '0'으로 새로 생성한다.