---
title: Javascript 30 Day 13
description: '13. Slide in on Scroll 스크롤을 내릴 때 마다 본문에 포함된 이미지들에 없어져다가 나타나는 효과를 적용한다. Debouncing 스크롤을 내리는 동작은 한 번 휠을 굴릴 때 마다 엄청나게 많은 이벤트를 발생시킨다. 이는 높은 가능성으로 성능저하를 발생시킬 수 있다. 이를 방지하고자 이벤트를 제한 하는…'
heroImage: '../../../../../../../assets/posts/Javascript-30-Day-13/2020-08-30-02-18-56.png'
pubDate: 2020-08-29 16:32:05
tags:
  - Javascript
  - Javascript30
category: Javascript


---



# 13. Slide in on Scroll

스크롤을 내릴 때 마다 본문에 포함된 이미지들에 없어져다가 나타나는 효과를 적용한다.

## Debouncing

스크롤을 내리는 동작은 한 번 휠을 굴릴 때 마다 엄청나게 많은 이벤트를 발생시킨다. 이는 높은 가능성으로 성능저하를 발생시킬 수 있다. 이를 방지하고자 이벤트를 제한 하는 방법이 _Debouncing_ 이다.
디바운싱과 비슷한 또다른 기법으로 `Throttle`도 존재한다. 두가지 방법 모두 EventHandler가 많은 연산을 수행하는 경우, 이벤트가 실행되는데 제약을 걸어 이를 제한할 수 있는 것을 목표로 하는 기술이다.

이러한 기법들은 생각보다 많은 경우에 필요로 되어지는데 다음과 같은 예시가 있을 수 있다.

- 스크롤을 내리는 동작에 걸린 이벤트
- 검색창에 데이터를 입력하면서 나타나는 추천 검색어를 찾기위한 `ajax`
- 창 리사이징을 추적하는데 걸리는 이벤트

각각의 상황에서 매 트리거가 작동될 때 마다 이벤트가 실행된다면 엄청난 과부하가 발생할것이다.

### 정의

**Debounce**는 이벤트를 그룹화하여 특정시간이 지난 후 하나의 이벤트만 발생하도록 하는 기술이다.

> `Debounce`: 연이어 호출되는 함수들 중 마지막 ( 또는 제일 처음 )함수만 호출되도록 하는 것

마지막에 처음 함수가 호출된 후 호출 동작이 멈출 때 까지 기다렸다가 마지막으로 호출되는 이벤트만 실제로 동작하는 하는 것이다. 우리는 브라우저를 리사이징 하는 동안의 값는 필요 없고 마지막 최종 크기만 관심이 있기 때문이다.

### Throttle

**Throttle**은 Debounce와 비슷하지만 다른 개념으로, 이벤트를 일정한 주기마다 발생하도록 한다.

> `Throttle`: 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 하는 것

스크롤 이벤트에 많이 사용된다. 몇 초에 한번 씩만 이벤트가 실행되도록 제한을 두는 것이다.

무한 스크롤링 페이지를 구현한다고 해보자. 사용자가 `footer`에서 얼마나 떨어져있는지 항상 확인하면서, 가까워졌을 경우 `ajax`를 통해 더 많은 컨텐츠를 요청해 페이지에 추가하는 작업이 필요하다. 따라서 사용자가 동작을 멈춰야 이벤트가 실행되는 Debounce 보다 여기서는 Throttle이 더 적합하다.

### Debounce & Throttle 차이점

둘의 차이점은 _이벤트를 얼마나 발생 시키느냐_ 라고 볼 수 있다. Debounce는 아무리 많은 이벤트가 발생해도 한번 실행된 연속된 이벤트 중 하나의 이벤트만 실행되는 반면, Throttle은 일정 시간마다 항상 이벤트의 실행을 보장한다.
스크롤 이벤트를 예로 들면 Debounce는 아무리 스크롤을 많이 내려도 동작을 멈추지 않으면 이를 `1`번의 이벤트로 실행시키지만 Throttle은 정해진 시간에 맞춰 `1`보다 많은 수의 이벤트를 발생시킬 것이다.

## 스크롤 이벤트

![](../../../../../../../assets/posts/Javascript-30-Day-13/2020-08-30-02-18-56.png)
이렇게 비어있던 자리에,
![](../../../../../../../assets/posts/Javascript-30-Day-13/2020-08-30-02-19-23.png)
스크롤을 내리면 이미지가 나타나는 애니메이션을 추가하는 기능을 `scroll` 이벤트로 등록하는 프로그램이다.
이때 모든 `scroll` 동작에 이벤트가 실행되면 과부하가 발생하기 때문에 `debounce`를 적용한다.

```js
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
window.addEventListener("scroll", debounce(checkSlide));
```

구글링을 하면 debounce용 코드는 쉽게 구할 수 있어 이번엔 직접 코드를 작성하지는 않았다.
_강의에서 debounce 함수라고 배웠긴 한데 사전에 공부한 debounce와는 내용이 달라 혼란스럽다. `timeout`을 주는 걸로 봐서 `throttle` 같은데..!?_

### 이미지 슬라이더 만들기

기본적으로 html틀에 이미지들은 `hidden` 상태이다.

```css
.align-left.slide-in {
  transform: translateX(-30%) scale(0.95);
}

.align-right.slide-in {
  transform: translateX(30%) scale(0.95);
}
```

`translateX` 속성으로 위치를 이동시켜 화면에서 보이지 않는다.

그리고 `active` 클래스를 가지는 엘리먼트에는 다음과 같은 속성이 추가된다.

```css
.slide-in.active {
  opacity: 1;
  transform: translateX(0%) scale(1);
}
```

따라서 사용자가 스크롤 하고 있는 현재 위치에 따라 `active` 클래스를 `img` 엘리먼트에 추가/삭제 작업을 시켜주면 되겠다.

이미지가 보여지는 것은 현재 스크롤이 이미지가 위치한 곳에서 반 이상되는 위치에 도달했을 때 이다. 또한 여기서 스크롤이 더 내려가거나 올라가 이미지가 창을 벗어날 경우 이미지는 다시 사라져야 한다.

이것을 계산하기 위해 사용되는 속성은 다음과 같다.

- `window.scrollY` : 브라우저의 top 에서 부터 현재 출력되고 있는 페이지 부분의 top 까지의 pixel 단위 높이
- `window.innerHeight` : 현재 출력되고 있는 페이지 부분의 window 내부 높이
- `image.offsetTop` : 페이지의 top 에서 부터 image의 top 까지의 높이

![](../../../../../../../assets/posts/Javascript-30-Day-13/2020-08-30-03-07-11.png)

이 속성들을 이용해 슬라이드가 될 위치를 계산하면 다음과 같다.

```js
// 이미지가 반 이상 출력되는 스크롤 위치에 도달 했을 때
const slideInAt = window.scrollY + window.innerHeight - sliderImage.height / 2;
// 이미지의 bottom 높이
const imageBottom = sliderImage.offsetTop + sliderImage.height;
```

그리고 현재 이미지가 슬라이드 되어야 하는 위치에 도달했는지 확인하고 `classList`를 추가 및 삭제 해준다.

```js
const isHalfShown = slideInAt > sliderImage.offsetTop;
const isNotScrolledPast = window.scrollY < imageBottom;
if (isHalfShown && isNotScrolledPast) {
  sliderImage.classList.add("active");
} else {
  sliderImage.classList.remove("active");
}
```

### Reference

[디바운스(Debounce)와 스로틀(Throttle) 그리고 차이점](https://webclub.tistory.com/607?category=501390)
