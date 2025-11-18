---
title: Javascript 30 - Day 3
description: 'Javascript30 Day3 CSS Variables css 속성을 웹 페이지에서 실시간으로 수정하는 기능을 자바스크립트로 구현했다. 여기서 쓰이는 가장 중요한 요소는 custom css, 사용자 지정 css 속성이다. Mozilla 설명 사용자 지정 css 정의: 접근: 사용하는 이유: 같은 속성값이 여러번 사용…'
pubDate: 2020-08-16 00:40:58
tags:
  - Javascript
  - Javascript30
category: frontend




---

## Javascript30 Day3 - CSS Variables
css 속성을 웹 페이지에서 실시간으로 수정하는 기능을 자바스크립트로 구현했다.
여기서 쓰이는 가장 중요한 요소는 custom css, 사용자 지정 css 속성이다.
[Mozilla 설명](https://developer.mozilla.org/ko/docs/Web/CSS/Using_CSS_custom_properties)
### 사용자 지정 css
- 정의: `--`
- 접근: `var()`
- 사용하는 이유: 같은 속성값이 여러번 사용 될 때, 따로 여러번 속성값을 써주는 것 보다 변수로 선언하고 사용하는 것이 가독성과 이용성 면에서 편리하기 떄문
주로 `:root {}` 내부에서 속성을 선언하여 사용하는 방식이 흔하다

ex) 
```css
    :root {
      --base: #ffc600;
      --spacing: 10px;
      --blur: 10px;
    }

    img {
      padding: var(--spacing);
      background: var(--base);
      filter: blur(var(--blur));
    }
```

### JS
- `element.dataSet` : `data-attribute` 로 커스텀 데이터 키 들을 Array 형식으로 불러온다.
- `document.documentElement.style.setProperty(element, value)` : html element의 style 속성을 지정한다.
- `change` : event를 걸 수 있는 동작 중 하나로 값이 변경되면 이벤트가 발생하게 된다.