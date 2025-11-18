---
title: Web Components
description: 'Web Components는 재사용이 가능한 커스텀 element를 만들 수 있게 해주는 기술이다. 캡슐화를 함으로써 나머지 코드와 별개로 실행된다. 따라서 코드가 섞여서 혼란을 가져오진 않을까 걱정할 필요 없이 여기저기 붙여 재사용 할 수 있다. 세 가지 주요 컨셉이 있다. Custom elements 커스텀 elem…'
heroImage: './202211291126.png'
pubDate: 2022-11-18 11:02:45
tags:
  - Javascript
category: frontend





---



Web Components는 재사용이 가능한 커스텀 element를 만들 수 있게 해주는 기술이다. 캡슐화를 함으로써 나머지 코드와 별개로 실행된다. 따라서 코드가 섞여서 혼란을 가져오진 않을까 걱정할 필요 없이 여기저기 붙여 재사용 할 수 있다.

세 가지 주요 컨셉이 있다.

## Custom elements
커스텀 element를 정의하게해주고 element의 동작을 구현하게 해주는 자바스크립트 API의 집합이다. 웹 컴포넌트 기능을 명시하는 클래스를 생성하여 웹 컵포넌트를 구현한다.
아래와 같이 `customElements.define()` 메서드로 커스텀 컴포넌트를 등록할 수 있다.

```js
class CustomComponent extends HTMLElement {
    constructor(){
        super();
    }
}

customElements.define('my-component', CustomComponent);
```

### Lifecycle Callbacks
web copmponent element에 발생하는 이벤트에 따른 callback 함수를 정의할 수 있다.

![lifecycle callbacks](./202211291126.png)

- connectedCallback: custom element가 document DOM에 처음 연결되었을 때 실행됨
- disconnectedCallback: custom element가 document DOM에서 연결이 해제될 때 실행됨
- adoptedCallback: custom element가 다른 새로운 document로 옮겨졌을 때 실행됨
- attributeChangedCallback: custom element의 attribute가 업데이터되었을 때 실행됨

## Shadow DOM
element 내부에 캡슐화된 'shadow' DOM 트리를 붙이는 자바스크립트 API의 집합이다. Shadow DOM은 메인 document DOM과 별개로 분리되어 렌더링된다. 이를 통해 element의 기능을 private하게 유지할 수 있다. style과 script 또한 document의 다른 파트와의 충돌없이 element 내부에만 적용이 가능해진다.

![shadow dom](./202211291118.png)

- Shadow host: shadow DOM이 부착되는 통상적인 DOM 노드
- Shadow tree: shadow DOM 내부의 DOM 트리
- Shadow boundary: shadow DOM이 끝나고, 통상적인 DOM이 시작되는 장소
- Shadow root: shadow 트리의 root 노드

아래와 같이 `Element.attachShadow()` 메서드로 `shadow root`를 부착할 수 있다.

```js
class CustomComponent extends HTMLElement {
    constructor(){
        super();
    }
    
    connectedCallback(){
        this.attachShadow({mode: 'open'});
    }
}
```

### shadow DOM attach mode
- open: 메인 페이지에서 shadowDOM에 접근 가능
- closed: 외부에서 shadowDOM에 접근 불가능

## HTML 템플릿 
`<template>`, `<slot>` element를 사용해 화면에 렌더링 되지않는 HTML element 템플릿을 작성할 수 있다.

```js
const template = document.createElement('template');
template.innerHTML = `
    <template id="my-paragraph">
        <p>My paragraph</p>
    </template>
`
```



## 참고
- [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- 
