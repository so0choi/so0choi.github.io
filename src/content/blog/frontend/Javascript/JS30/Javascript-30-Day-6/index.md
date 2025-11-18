---
title: Javascript 30 - Day 6
description: 'Javascript30 Day6 Type Ahead fetch를 사용한 서버와의 비동기적 통신을 이용해 필요하 데이터를 불러와 웹페이지에 출력한다. 예제에 사용된 JSON data는 다음 endpoint의 도시별 인구수 데이터를 나타내는 endpoint가 사용된다. 이번에 만들 서비스는 입력한 영문자를 포함하고 있는 도…'
pubDate: 2020-08-18 10:41:08
tags:
  - Javascript
  - Javascript30
category: frontend




---

## Javascript30 Day6 - Type Ahead
fetch를 사용한 서버와의 비동기적 통신을 이용해 필요하 데이터를 불러와 웹페이지에 출력한다.
예제에 사용된 JSON data는 [다음](https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json) endpoint의 도시별 인구수 데이터를 나타내는 endpoint가 사용된다.

이번에 만들 서비스는 입력한 영문자를 포함하고 있는 도시 또는 주(state)의 인구 수를 표시하는 웹 페이지이다.

### fetch

기존의 Ajax로 하던 작업들을 비슷하게 할 수 있게 해주는 메서드이다. 
- 문법
```js
let promis = fetch(url, [options]);
```
options에 아무것도 넘기지 않으면 요청은 `GET` 메서드로 진행되어 `url`로부터 컨텐츠가 다운로드 된다.
return type은 `promise` 객체이다.

### promise 
- 자바스크립트 비동기 처리에 사용되는 객체. 주로 서버에서 받아오는 데이터를 동작에 이용할 때 데이터를 받아오는 작업이 끝나고 나서 동작해야 오류가 발생하지 않으므로 작업이 순차적으로 완료되어야 한다. 이를 보장하기 위해 사용되는 객체가 `promise`이다.

`promise`객체는 fetch 응답을 처리하는 다양한 메서드를 가지고 있다.

- `response.text()` : 응답을 텍스트로 반환
- `response.json()` : 응답을 JSON 형태로 파싱
- `response.blob()` : 응답을 Blob(타입이 있는 바이너리 데이터) 형태로 반환

`promise` 다음에 동기화적으로 이루어져야 하는 작업에는 `.then` 키워드를 사용해 지정할 수 있다.

```js
const cities = [];
const prom = fetch(endpoint)
  .then(blob => blob.json())
  .then(data => cities.push(...data));
```
여기서 `...`는 double nested를 방지하기 위해서이다. `...`키워드를 사용하지 않으면 다음과 같이 빈 Array 속에 data가 nested된다.
```
[]
    0: Array(1000)
    [0 … 99]
    [100 … 199]
    [200 … 299]
    [300 … 399]
    [400 … 499]
    [500 … 599]
    [600 … 699]
    [700 … 799]
    [800 … 899]
    [900 … 999]
```

### 정규표현식 Regex
데이터를 불러왔다면 이제 찾고자 하는 data, 즉 입력창에 들어온 글자를 포함하고 있는 지역들을 `filter`로 분류해야 한다. 여기서 정규표현식을 사용하면 쉽게 해결할 수 있다.

```js
const regex = new RegExp(this.value, 'gi');
```
- g - gloabl. 모든 match를 찾는다
- i - insensitive. 영어 대문자/소문자를 구분하지 않고 찾는다

정규식으로 찾은 조건에 맞는 data들 각각을 `map` 메서드를 이용해 html element로 변환한다. 검색한 문자열과 같은 부분은 highlight 되도록 `hl` class에 넣어서 반환한다.

```js
 function displayMatches(){
    const matchArray = findMatches(this.value, cities);
    const html = matchArray.map(place => {
      const regex = new RegExp(this.value, 'gi');
      const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
      const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`);
      return `
        <li>
          <span class="name">${cityName}, ${stateName}</span>
          <span class="population">${numberWithCommas(place.population)}</span>
        </li>
      `;
    }).join('');

    suggestions.innerHTML = html;
  }
```

### Event Listener
`input`이 바뀔 때 마다 표시되는 데이터가 달라지므로 `change`, `keyup` 동작에 이벤트를 활성화 해놓는다.

```js
  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', displayMatches);
```
