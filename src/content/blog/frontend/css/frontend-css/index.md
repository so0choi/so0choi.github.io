---
title: CSS 복합 선택자
description: 'CSS 복합 선택자 Basic Combinator E 와 F를 동시에 만족하는 요소를 선택한다. 이면서 class인 요소를 선택한다. Child Combinator E의 자식 요소 F를 선택한다. 의 자식 요소 중 class가 orange인 요소를 선택한다. Descendant Combinator E의 하위 요소 F를…'
pubDate: 2020-09-02 21:35:15
tags:
  - Web Programming
  - CSS
category: frontend





---



## Basic Combinator

E 와 F를 동시에 만족하는 요소를 선택한다.

```css
span.orange {
  ...;
}
```

```html
<div>
  <ul>
    <li>사과</li>
    <li>딸기</li>
    <li class="orange">오렌지</li>
  </ul>
  <div>당근</div>
  <p>토마토</p>
  <span class="orange">오렌지</span>
  <!--선택-->
</div>
```

`span`이면서 `orange` class인 요소를 선택한다.

## Child Combinator

E의 자식 요소 F를 선택한다.

```
E > F
```

```css
ul > .orange {
  color: red;
}
```

```html
<div>
  <ul>
    <li>사과</li>
    <li>딸기</li>
    <li class="orange">오렌지</li>
    <!--선택-->
  </ul>
  <div>당근</div>
  <p>토마토</p>
  <span class="orange">오렌지</span>
</div>
```

`ul`의 자식 요소 중 class가 orange인 요소를 선택한다.

## Descendant Combinator

E의 하위 요소 F를 선택한다.

```
E F
```

```css
div .orange {
  color: red;
}
```

```html
<div>
  <ul>
    <li>사과</li>
    <li>딸기</li>
    <li class="orange">오렌지</li>
    <!--선택-->
  </ul>
  <div>당근</div>
  <p>토마토</p>
  <span class="orange">오렌지</span>
  <!--선택-->
</div>
```

`div`의 모든 하위 요소 중, orange class 인 모든 요소가 선택된다.

## Adjacent Sibling Combinator

E의 다음 형제 요소 중 F 하나만 선택한다.

```
E + F
```

```css
.orange + li {
  color: red;
}
```

```html
<ul>
  <li>딸기</li>
  <li>수박</li>
  <li class="orange">오렌지</li>
  <li>망고</li>
  <!--선택-->
  <li>사과</li>
</ul>
```

`orange` 클래스를 가지는 요소의 다음 형제 요소가 선택되었다.

## General Sibling Combinator

E의 다음 형제 요소 F를 모두 선택한다.

```
E ~ F
```

```css
.orange ~ li {
  color: red;
}
```

```html
<ul>
  <li>딸기</li>
  <li>수박</li>
  <li class="orange">오렌지</li>
  <li>망고</li>
  <!--선택-->
  <li>사과</li>
  <!--선택-->
</ul>
```

orange class를 가지는 요소의 **다음**에 위치하는 모든 형제 `li`태그들이 선택되었다.

# 가상 클래스 선택자

가상 클래스 선택자 앞에는 `:` 키워드가 사용된다.

## hover

E에 마우스가 올라가 있는 동안에만 E를 선택한다.

```
E:hover
```

```css
a:hover {
  color: red;
}
```

```html
<a href="http://www.naver.com">NAVER</a>
```

`a` 태그에 마우스를 올렸을 때만 글자가 빨간색으로 변한다.

## active

E를 마우스로 클릭하는 동안에만 E를 선택한다.

```
E:active
```

## focus

E가 포커스 된 동안만 E를 선택한다. (대화형 컨텐츠에만 사용가능 - `img`, `input` 등)

```
E.focus
```

## first-child / last-child

E 태그 요소들 중 부모의 첫번째 자식인 요소를 선택한다. (`last-child도 비슷한 개념)

```
E:first-child
```

```css
.fruits li:first-child {
  color: red;
}
```

```html
<div class="fruits">
  <li>망고</li> <!--선택-->
  <ul class="fruits">
  <li>딸기</li>  <!--선택-->
  <li>사과</li>
  <li>오렌지</li>
  <li>망고</li>
</ul>
</div>
<input type="text"></input>
```

fruits class인 요소들의 첫번째 자식이 `li`라면 모두 선택된다.

## nth-child

E가 형제 요소 중 n 번째 자식이라면 선택한다. (`n` 키워드 사용시 zero base)

```
E:nth-child(n)
```

```css
.fruits li:nth-child(2) {
  color: red;
}
```

```html
<ul class="fruits">
  <li>딸기</li>
  <li>사과</li>
  <!--선택-->
  <li>오렌지</li>
  <li>망고</li>
</ul>
```

fruits class의 하위 `li`요소 중 `2`번째 요소를 선택한다.

```css
.fruits li:nth-child(2n) {
  color: red;
}
```

n이 `0`부터 시작되어 `2*n` 번째 요소를 선택한다. 즉 **짝수**번째 요소만 선택된다.

```css
.fruits li:nth-child(n + 3) {
  color: red;
}
```

n이 `0`부터 시작되어 `0+3`번째 요소부터 시작하여 `1+3`, `2+3` ... 모두 선택한다. 즉 세번째 요소부터 모두 선택한다.

### nth-child의 주의할 점

```css
.fruits p:nth-child(1) {
  color: red;
}
```

```html
<!--선택된 요소 없음-->
<div class="fruits">
  <div>딸기</div>
  <p>사과</p>
  <p>망고</p>
  <span>오렌지</span>
</div>
```

위 css 코드는 '`fruits class` 하위 요소들 중, `p` 태그인 `1`번째 자식을 선택한다. '로 이해할 수도 있다. 하지만 실제로 선택자는 `fruits class`의 후손인 `1`번째 자식인 `p` 태그의 선택을 의미한다.

## nth-of-type

E의 태그이름과 동일한 타입인 형제 요소 중, E가 n번째 요소라면 선택한다. (`n`키워드 사용시 zero-base)

```
E:nth-of-type(n)
```

```css
.fruits p:nth-of-type(1) {
  color: red;
}
```

```html
<div class="fruits">
  <div>딸기</div>
  <p>사과</p>
  <!--선택-->
  <p>망고</p>
  <span>오렌지</span>
</div>
```

`p`태그 중 첫번째 요소를 선택한다.

## not

S가 아닌 E 선택

```
E:not(S)
```

```css
.fruits li:not(.strawberry) {
  color: red;
}
```

```html
<ul class="fruits">
  <li>오렌지</li>
  <!--선택-->
  <li class="strawberry">딸기</li>
  <li>망고</li>
  <!--선택-->
  <li>사과</li>
  <!--선택-->
</ul>
```

fruits class 하위의 `strawberry` 클래스의 요소가 아닌 `li` 태그들을 선택한다.

# 가상 요소 선택자

가상 요소 선택자는 키워드 앞에 `::`가 붙는다.

## before

E 요소 내부의 앞에, 내용을 삽입한다. 이때 `content` 속성을 지정하지 않으면 아무 효과가 적용되지 않는다. 내용이 없더라도 `''`으로 빈 데이터를 지정해야한다.

```css
ul li::before {
  content: "";
  width: 30px;
  height: 30px;
  display: inline-block;
  background: tomato;
  margin-right: 10px;
}
```

`url()`을 통해 이미지도 삽입 할 수 있다.

## after

E 요소 내부의 뒤에 내용을 삽입한다.

```
E::after
```

```css
ul li::after {
  content: ".0";
}
```

```html
<ul>
  <li>1</li>
  <!-- 1.0 -->
  <li>2</li>
  <!-- 2.0 -->
  <li>3</li>
  <!-- 3.0 -->
  <li>4</li>
  <!-- 4.0 -->
</ul>
```

각 `li` 요소의 내부 value 뒤쪽에 `.0`을 추가한다. (`$` 키워드 사용시 1씩 증가하는 숫자가 추가된다.)

# 속성 선택자

## attr

속성 `attr`을 포함한 요소를 선택한다

```
[attr]
```

```css
[disabled] {
  opacity: 0.2;
}
```

```html
<input type="text" value="Hello" />
<input type="password" value="1234" />
<input type="text" value="disabled text" disabled />
<!-- 선택 -->
```

## attr=value

속성 attr 을 포함하며, 속성 값이 value인 요소를 선택한다.

```
[attr=value]
```

```css
[type="password"] {
  color: red;
}
```

```html
<input type="text" value="Hello" />
<input type="password" value="1234" />
<input type="text" value="disabled text" />
```

## attr^=value

속성 attr을 포함하며 속성 값이 value로 시작하는 요소를 선택한다.

```
[attr^=value]
```

```css
[class^="btn-"] {
  font-weight: bold;
  border-radius: 4px;
  font-size: 40px;
}
```

```html
<button class="btn-success">Success</button>
<!--선택-->
<button class="btn-danger">Danger</button>
<!-- 선택-->
<button>Normal</button>
```

`btn`으로 시작하는 class value를 가지는 요소들이 선택된다.

## attr\$=value

속성 attr을 포함하며 속성 값이 value로 끝나는 요소를 선택한다.

```
[attr$=value]
```

```css
[class$="success"] {
  color: green;
}
[class$="danger"] {
  color: red;
}
```

```html
<button class="btn-success">Success</button>
<button class="btn-danger">Danger</button>
<button>Normal</button>
```

`success`로 끝나는 클래스 이름을 가진 요소의 글자는 초록색이 되고, `danger`로 끝나는 클래스 이름을 가진 요소의 글자는 빨간색이 된다.

# 상속

상위 요소에 적용된 css 속성은, 하위 요소들에게도 적용된다. 하지만 모든 속성이 상속되는 것은 아니고, 주로 text를 다루는 속성들이 상속이 가능하다.

## 강제 상속 `inherit`

상속되지 않는 css 속성도 강제로 상속 되도록 할 수 있다.

```html
<div class="parent">
  <div class="child"></div>
</div>
```

```css
.parent {
  position: absolute;
}
.child {
  position: inherit;
}
```

`position` 속성은 상속되지 않는 속성이다. 하지만 자식 요소인 `.child`의 position 속성을 `inherit`으로 설정하면서 강제 상속을 시킬 수 있다.

## Reference

[CSS 속성](https://happy-noether-c87ffa.netlify.app/presentations/level1/css/properties/)
