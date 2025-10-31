---
title: window.resize throttle 설정
description: 'window.resize throttle 설정 이벤트에 리스너를 걸게되면 사이즈가 바뀌는 매순간 이벤트가 발생하기 때문에 성능 저하가 발생할 수 있다. 이것을 막기 위해 취하는 해결방법에 와 이 있다. 이전에 정리 포스팅을 올린 것 같은데 아무리 찾아도 없다..ㅠㅠ? 이벤트에 걸린 핸들러를 이벤트가 종료된 시점에 한 번…'
pubDate: 2020-10-08 00:10:43
tags:
  - window.resize
  - Javascript
category: Javascript


---



`window.resize` 이벤트에 리스너를 걸게되면 사이즈가 바뀌는 매순간 이벤트가 발생하기 때문에 성능 저하가 발생할 수 있다.

이것을 막기 위해 취하는 해결방법에 `debounce`와 `throttle`이 있다. _이전에 정리 포스팅을 올린 것 같은데 아무리 찾아도 없다..ㅠㅠ?_

`resize` 이벤트에 걸린 핸들러를 이벤트가 종료된 시점에 한 번만 호출 되도록 하기위해 `throttle`을 사용했다. 이는 [MDN 사이트](https://developer.mozilla.org/ko/docs/Web/API/Window/resize_event)에서 찾은 방식이다. 검색을 해보면 정말 다양한 방식으로 구현할 수 있는데, ([Stackoverflow - How to wait for the 'end' of 'resize' event and only then perform an action?](https://stackoverflow.com/questions/5489946/how-to-wait-for-the-end-of-resize-event-and-only-then-perform-an-action)) MDN에 올라온 방식이 가장 깔끔한 것 같다.

## throttle

`throttle`은 간단히 말해서 일정 timer를 걸어두고 그 시간 내에는 이벤트를 활성화 시키지 않는 것이다. 예를들어 window창의 `resize`를 계속해서 발생시키더라도, timer를 3초 걸어두면 3초 이내에 동작된 `resize` 이벤트 들에는 `EventListener`가 동작하지 않게 하는 방식을 `throttle`이라 한다.

## 코드

```js
const delay = 300;
let timer = null;
function resizeThrottler(callback) {
  if (!timer) {
    timer = setTimeout(() => {
      timer = null;
      callback();
    }, delay);
  }
}
```
