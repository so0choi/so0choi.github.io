---
title: "[React Native] screenshot 다루기"
description: '보호된 영상 컨텐츠의 스크린샷을 막기위해 리서치를 진행했다. 몇가지 방법을 찾았는데 결론부터 말하자면 IOS / Android 양쪽에서 완벽하게 캡처 동작을 막을수는 없다. 그래도 이벤트를 감지해 후처리를 해줄 수는 있다. react native screen capture secure ScreenCaptureSecure…'
heroImage: './IMG_1777.PNG'
pubDate: 2022-02-23 11:02:16
category: React Native





---






보호된 영상 컨텐츠의 스크린샷을 막기위해 리서치를 진행했다. 몇가지 방법을 찾았는데 결론부터 말하자면 IOS / Android 양쪽에서 완벽하게 캡처 동작을 막을수는 없다. 그래도 이벤트를 감지해 후처리를 해줄 수는 있다.

## react-native-screen-capture-secure

[ScreenCaptureSecure Github](https://github.com/lizhming/ScreenCaptureSecure)에서 코드를 확인할 수 있다.

```js
import ScreenCaptureSecure from "react-native-screen-capture-secure";

ScreenCaptureSecure.enableSecure();
ScreenCaptureSecure.disableSecure();
```

간단하게 사용이 가능하다. `enableSecure()`를 실행하고 화면을 캡처하면 경고창이 뜬다.

![warning image](./IMG_1777.PNG)

모듈 파일로 들어가서 경고 메세지를 수정할 수도 있다.

## expo-screen-capture (android only)

## react-native-screenshot-detect (ios only)
