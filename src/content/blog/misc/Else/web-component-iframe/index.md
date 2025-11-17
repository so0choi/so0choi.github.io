---
title: Web Component 대신 iframe을 선택한 이유
description: '내가 개발한 페이지에서 커스텀 플레이어를 만들 수 있는 부분만 기존 서비스에 추가하기 위한 작업을 시작했다. 기존 페이지에 영향을 주지 않으면서 컴포넌트를 추가하기 위한 기술을 찾아보니 웹 컴포넌트라는게 있었다. 생각보다 오래전부터 존재했던 기술이라 신기했다. 생소한 개념이라 여러가지를 리서치했다. 생각보다 종류가 많았…'
heroImage: './2022-10-06-5-41-15.png'
pubDate: 2022-10-06 17:02:39
category: Else
tags:


---



내가 개발한 페이지에서 커스텀 플레이어를 만들 수 있는 부분만 기존 서비스에 추가하기 위한 작업을 시작했다. 

![플레이어 컴포넌트](./2022-10-06-5-41-15.png)

기존 페이지에 영향을 주지 않으면서 컴포넌트를 추가하기 위한 기술을 찾아보니 웹 컴포넌트라는게 있었다. 
생각보다 오래전부터 존재했던 기술이라 신기했다. 생소한 개념이라 여러가지를 리서치했다. 
생각보다 종류가 많았는데 그 중 [Stencil](https://github.com/ionic-team/stencil)를 선택했다. 
프레임워크도 여러가지가 있었는데 Stencil도 프레임워크 같아 보이지만 '웹 컴포넌트 컴파일러'라고 한다.

## 웹 컴포넌트

코드를 캡슐화하여 재사용 가능한 커스텀 엘리먼트를 생성하고 웹 앱에서 활용할 수 있도록 해주는 다양한 기술들의 모음이다.
아래 세 가지 주요 기술들로 구성된다.

- Custom elements: 사용자 인터페이스에서 원하는대로 사용할 수 있는 사용자 정의 요소 및 해당 동작을 정의 할 수 있는 Javascript API 세트
- Shadow DOM: 캡슐화된 Shadow DOM 트리. 메인 Document DOM으로부터 독립적으로 렌더링된다. document의 다른 부분과의 충돌에 대한 걱정 없이 스크립트와 스타일을 작성할 수 있다.
- HTML template: `<templa>` 과 `<slot>` 엘리먼트는 렌더링된 페이지에 나타나지 않는 마크업 템플릿을 작성하게 해준다.

아무래도 iframe보다 최신 기술인 웹 컴포넌트를 써보고 싶었으나.. 결국 사용하지 못하게 되었다.

## 사용하지 못한 이유

내가 만들고자 했던 웹 컴포넌트에는 jw 플레이어 라이브러리를 사용중이다. 플레이어 실행 코드는 아래와 같다.

```js
jwplayer('#player').setup({ /* player config options */});
jwplayer(document.querySelector('#player')).setup({ /* player config options */});
```

위 두 가지 방법으로 실행이 가능한데 페이지의 HTMLElement를 넘기면 플레이어가 추가되는 방식이다. 
나는 Shadow DOM 내부에서 플레이어를 실행하기 위해 해당 Element를 넘겼다.

```js
jwplayer(this.el.shadowRoot.querySelector('#player')).setup({ /* player config options */});
```

이렇게 하면 ShadowDOM 내부에 플레이어는 삽입이된다. 그러나 문제는 jwplayer의 실행 코드가 document 내부에 플레이어의 `style` 코드를 추가시키는데 이 때 ShadowDOM의 내부가 아닌 외부 document에 추가가 된다는 점이다.
Shadow DOM 과 외부 document는 각자에 작성된 style이 영향을 주지 못하기 때문에 플레이어를 정상적으로 사용할 수 없었다.

결국 웹 컴포넌트 대신 iframe으로 구성하기로 결정!
새로운 기술은 매력적이지만 상황에따라서는 사용할 수 없음을 인정하고 다른 방법을 찾는 것도 중요한 것 같다.
프론트 기술이라 또 사용해야 할 때가 올 지는 모르겠지만 공부해보기엔 재미있었다.