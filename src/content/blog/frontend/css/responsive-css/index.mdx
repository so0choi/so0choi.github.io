---
title: "[css] @media을 사용하는 반응형 웹"
description: '반응형 웹 페이지 css 속성에서 자주 보던 속성이다. 태블릿이나 휴대폰 등 다양한 크기의 디바이스에서 웹에 접속하는 트렌드에 맞게, 웹페이지 또한 어느 기기에서나 올바르게 출력될 수 있도록 설정해두는 것이 중요하다. @media 다양한 미디어 유형이나 장치에 따라 서로 다른 스타일 규칙을 적용시킨다. 문법 예시 med…'
pubDate: 2020-09-13 01:27:24
tags:
  - Web Programming
  - CSS
category: WEB

---


반응형 웹 페이지 css 속성에서 자주 보던 속성이다. 태블릿이나 휴대폰 등 다양한 크기의 디바이스에서 웹에 접속하는 트렌드에 맞게, 웹페이지 또한 어느 기기에서나 올바르게 출력될 수 있도록 설정해두는 것이 중요하다.

## @media

다양한 미디어 유형이나 장치에 따라 서로 다른 스타일 규칙을 적용시킨다.

### 문법

```css
@media 미디어타입 and (미디어 특성){
    css 작성
}
```

예시

```css
@media screen and (max-width: 1200px) {
  body {
    color: red;
  }
}
```

## media type 종류

- `all` : 모든 미디어 타입에 적용 (default)
- `screen` : 컴퓨터 화면, 타블렛, 스마트폰 등
- `print` : 인쇄전용

생략이 가능하다.

## media 특성

- `width` : 뷰포트 가로 너비
- `max-width` : 뷰포트 최대 가로 너비(이하)
- `min-width` : 뷰포트 최소 가로 너비(이상)
- `orientation` : 뷰포트 방향(`landscape`:가로가 길 때 / `portrait` : 세로가 길 때 )

`height`도 비슷하게 사용된다. `max-width`, `min-width`, `orientation` 속성들이 가장 많이 쓰인다.

## 예제

뷰포트가 일정 픽셀 이하가 되면 메뉴 버튼이 나타나도록 하기

보통 태블릿 화면을 구현할 때 사용하는 `max-width`가 `1024px`이다.
'이하'를 나타내기 위해 `max-width`를 사용한다.

```css
@media (max-width: 1024px) {
  header.section .inner {
    max-width: none;
    height: auto;
    padding: 0 20px;
  }
  ...생략...
```

버튼을 누르면 없어져야 할 html 요소들에 `toggle`, `on` 클래스를 추가한다. 그리고 css 선택자로 `display` 속성을 지정한다.

```css
header .toggle {
  display: none;
}
header .toggle.on {
  display: block;
}
```

_.toggle .on 을 사용하면 toggle 클래스를 가지면서 on 클래스 또한 가지는 요소들을 선택한다._

js로 버튼 클릭 이벤트를 작성한다.

```js
(function (window, document) {
  "use strict";
  const $toggles = document.querySelectorAll(".toggle"); // NodeList
  const $toggleBtn = document.getElementById("toggle-btn");
  $toggleBtn.addEventListener("click", toggleElements);
  function toggleElements() {
    [].forEach.call($toggles, function (toggle) {
      toggle.classList.toggle("on");
    });
  }
})(window, document);
```

`use strict`는 엄격한 js 문법을 사용하겠다는 뜻이다.
`$` 사인은 document 요소를 불러온 변수에 붙이는 identifier 라고 한다. _Dev-matching 때 이걸 처음 봤었는데 그땐 뭔가 싶었다._

`querySelectorAll`는 `NodeList`라는 유사 배열 객체를 반환하기 때문에 `call`을 사용해 객체 하나씩에 접근 하는 방식을 사용한다.

빈 배열을 사용하는 이유는, 이렇게 적는 방식이 `Array.prototype.forEach.call(...)` 를 작성하는 것 보다 빠르기 때문이다.

`classList.toggle()`을 사용해 클래스를 토클 시킬 수 있다. `Javascript 30` 에서도 자주 쓰였던 기능인데 벌써 깜빡하고 말았다. :sob:
비슷한 기능으로 `classList.remove()`를 사용하면 지정한 클래스를 엘리먼트에서 지울 수 있다.
JS 에서는 카멜 표기법을 쓰는 점도 기억해야겠다.

## Reference

- [[].forEach.call()의 의미](https://www.it-swarm.dev/ko/javascript/foreachcall-%EC%9D%80-javascript%EC%97%90%EC%84%9C-%EB%AC%B4%EC%97%87%EC%9D%84%ED%95%A9%EB%8B%88%EA%B9%8C/1072215681/)
- [The Dollar Sign (\$) and Underscore (\_) in JavaScript](https://www.thoughtco.com/and-in-javascript-2037515)
