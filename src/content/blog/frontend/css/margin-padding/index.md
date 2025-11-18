---
title: "[css] margin & padding"
description: 'margin 은 element의 바깥 여백 속성이다. 두 요소가 붙어있을 경우 marign이 상쇄되는 상황이 있는데 잘 정리된 블로그 글을 찾았다. 정말 깔끔하게 잘 정리해주셨다. 헷갈릴때 마다 확인해야 할 것 같다. margin이 상쇄되는 여러가지 조건이 있는데 이를 방지하기 위해서는 border 값을 주던가 padd…'
pubDate: 2020-08-24 14:45:47
tags:
  - CSS
category: frontend




---


![css element](https://www.w3.org/TR/CSS2/images/boxdim.png)

## margin

`margin`은 element의 바깥 여백 속성이다. 두 요소가 붙어있을 경우 marign이 상쇄되는 상황이 있는데 잘 정리된 [블로그 글](https://velog.io/@raram2/CSS-%EB%A7%88%EC%A7%84-%EC%83%81%EC%87%84Margin-collapsing-%EC%9B%90%EB%A6%AC-%EC%99%84%EB%B2%BD-%EC%9D%B4%ED%95%B4)을 찾았다. 정말 깔끔하게 잘 정리해주셨다. 헷갈릴때 마다 확인해야 할 것 같다.

margin이 상쇄되는 여러가지 조건이 있는데 이를 방지하기 위해서는 border 값을 주던가 padding을 조절하는 방법이 있다.

element를 중앙에 정렬시킬 때 다양한 방법이 있지만 margin을 활용하는 방법도 있다. 기본적으로 `div` 요소는 위, 아래는 content 내용에 딱 맞게, 그리고 양 사이드의 너비는 100%로 주어진다.

이런 `div` 요소에 width를 지정하고 margin을 `auto`로 줄 경우 위, 아래 크기 즉 height는 content 크기 만큼으로 유지하지만 width는 지정한 크기만큼만 갖게 되면서 사이드의 marign 값을 같은 값으로 가지게 되어 결과적으로 중앙 정렬을 하게 된다.

## padding

`padding`은 element의 내부 여백 속성이다. 내부에 여백을 줌으로써 결과적으로 element의 전체 크기가 커지게 된다.

위 사진에서 content의 크기가 `130 x 150`이라고 가정하고 padding 값을 20으로 준다면, element의 총 크기는 위 아래 양 옆 내부 padding값이 더해져 `130+(20*2) x 150+(20*2)`가 되는 것이다.

padding 속성을 사용하면 수직 중앙 배열을 할 수 있다. 지금은 `flex`를 사용해서 더 쉽게 구현할 수 있지만 기존 css 방식에서는 좀 더 까다롭게 수직 중앙 배열을 구현해야만 했다.

## 수평 배치

html element들은 기본적으로 수직 배치를 갖는다.
이때 `float` 속성을 사용할 수 있다.

## float

float 속성을 주면 해당 요소는 '띄워지게' 된다. 그리고 기본적으로 수평 배치를 하게 된다. 하지만 이때 이 요소들은 떠 있기 때문에 부모 element들이 인식을 하지 못하게 되는데 이를 방지하기 위한 적절한 부가 조치도 필요하다.

```html
<div class="menu clearfix">
  <div class="menu-item">Personal</div>
  <div class="menu-item">Open Source</div>
  <div class="menu-item">Business</div>
  <div class="menu-item">Explore</div>
</div>
```

html이 이런식으로 구성되어있을 때 `menu-item`들을 수평 배치하고 싶다면 아래와 같이 css 속성을 지정하면 된다.

```css
.menu-item {
  float: left;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

즉 수평으로 배치하고 싶은 각각의 요소들에 `flot:left` 속성을 주고, 그 요소들의 부모 요소에 `float`을 무시하는 `clear`속성을 줌으로써 구현 가능하다.

## 속성을 줄 때 주의할 점

### body에 기본으로 들어간 margin

내가 생성한 html 요소가 페이지를 꽉 채웠으면 좋겠는데 내가 지정하지 않은 여백이 페이지에 생긴 경우가 있다. 웹 브라우저가 기본적으로 가지는 margin 값이 있기 때문이다. 따라서 적절하게 초기화 해줄 필요가 있는데 이를 도와주는 속성값 모음을 인터넷 검색을 통해서도 찾을 수 있고, 간단하게는 그냥 margin과 padding 값을 0으로 지정함으로써 오류를 방지할 수 있다.

```css
body {
  margin: 0;
  padding: 0;
}
```

### css 속성값은 어느 요소에 지정해야 할까

css 속성을 줄 때 어느 요소에 그 값을 지정해도 같은 결과가 나올 때가 많다. (margin값을 지정하는 등의 작업에서 특히) 이 경우 그 속성 값을 직접적으로 영향 받는 요소와 가장 가까운 위치에 있는 element에 속성을 주는 것이 가장 적합한 방식이다.
