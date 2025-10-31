---
title: Event handler의 등록 및 삭제
description: 'Event handler의 등록 및 삭제 이벤트 등록 EventTarget.addEventListener() Argument type: 이벤트 유형을 나타내는 문자열 listner: 이벤트 알림을 받는 function 객체 options capture: 으로 전송하기 전, 등록된 리스너로 이벤트의 전송여부를 나타내는 B…'
pubDate: 2022-01-12 09:37:21
tags: Javascript
category: Javascript


---



## 이벤트 등록

EventTarget.addEventListener()

> target.addEventListener(type, listener[, options]);
> target.addEventListener(type, listener[, useCapture]);

### Argument

- type: 이벤트 유형을 나타내는 문자열
- listner: 이벤트 알림을 받는 function 객체
- options
  - capture: `EventTarget`으로 전송하기 전, 등록된 리스너로 이벤트의 전송여부를 나타내는 Boolean
  - once: 리스너를 추가한 후 한 번만 호출되어야 하는지를 나타내는 Boolean (`true`이면 호출할 때 리스너가 자동 삭제됨)
  - passive: true이면 리스너에서 지정한 함수가 `preventDefault()`를 호출하지 않음을 나타내는 Boolean
- useCapture: options의 capture와 같음. 트리에서 위쪽으로 버블링되는 이벤트는 캡처를 사용하도록 지정된 리스너를 트리거하지 않는다.

_이벤트 리스너는 단일 매개 변수 (event)를 가지는 콜백 함수로 지정할 수 있다!_

### 사용 예시

```js
function keydownEventHandler(evt) {
  if (evt.key === "ArrowLeft") {
    evt.stopImmediatePropagation();
  }
  if (evt.key === "ArrowRight") {
    evt.stopImmediatePropagation();
  }
}

document.addEventListener("keydown", keydownEventHandler, true);
```

## 이벤트 삭제

EventTarget.removeEventListner()

> target.removeEventListener(type, listener[, options]);
> target.removeEventListener(type, listener[, useCapture]);

EventTarget.addEventListener()로 등록한 이벤트 리스너를 삭제한다. 등록시 제공했던 다양한 옵션과 **일치**하는 이벤트 리스너만 제거할 수 있다.

### 사용 예시

위에 등록한 `keydown` 이벤트 리스너를 삭제하려면 다음과 같은 작업을 해야한다.

```js
document.removeEventListener("keydown", keydownEventHandler, true);
```

옵션을 다르게 하면 삭제되지않는다.

```js
document.removeEventListener("keydown", keydownEventHandler, false); // 옵션이 다르기 때문에 삭제 실패
```

또한 가리키는 리스너가 같아야 삭제가 정상적으로 이루어진다. 즉, 익명 함수로 리스너 등록 및 삭제시 _삭제가 이루어지지 않는다!_

### 리스너 초기화를 통한 삭제 방식

`removeEventListenr()` 이외의 다른 방법으로 리스너를 `null`로 초기화 하는 방법도 있다.

```js
// 등록
document.onkeydown = (f) => myMethod();

// 삭제
document.onkeydown = null;
```
