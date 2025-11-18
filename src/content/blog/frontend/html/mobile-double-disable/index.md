---
title: "[HTML] 모바일 디바이스에서 double-tap 줌인 disable"
description: '모바일 디바이스에서 더블탭 동작 시 화면인 줌인 되는 이벤트가 있다. 추가 구현중인 기능에 해당 동작이 방해가 되어 disable 하는 법을 찾아 기록해놓는다. meta 태그 추가 참고 Disable double tap "zoom" option in browser on touch devices'
pubDate: 2022-08-10 10:03:21
tags:
  - html
category: frontend




---


모바일 디바이스에서 더블탭 동작 시 화면인 줌인 되는 이벤트가 있다.
추가 구현중인 기능에 해당 동작이 방해가 되어 disable 하는 법을 찾아 기록해놓는다.

## meta 태그 추가

```html
<head>
  <title>Site</title>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  etc...
</head>
```

## 참고

- [Disable double-tap "zoom" option in browser on touch devices](https://stackoverflow.com/questions/10614481/disable-double-tap-zoom-option-in-browser-on-touch-devices)
