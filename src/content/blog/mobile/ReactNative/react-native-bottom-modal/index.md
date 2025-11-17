---
title: React Native bottom modal 넣기
description: '내가 선택한 라이브러리는 @gorhom/bottom sheet이다. 위클리 다운로드 10만을 넘는 라이브러리로 깔끔한 도큐먼트 페이지도 있어 믿고 사용할 수 있었다. (공식 홈페이지) ) Installation 작성일 기준 설치방법이다. 추가로 설치가 필요한 라이브러리가 있다. expo 사용하지 않는 경우 expo 사용…'
heroImage: './React-Native-bottom-modal.png'
pubDate: 2023-03-07 14:31:07
category: React Native
tags:






---







내가 선택한 라이브러리는 [@gorhom/bottom-sheet](https://www.npmjs.com/package/@gorhom/bottom-sheet)이다. 위클리 다운로드 10만을 넘는 라이브러리로 깔끔한 도큐먼트 페이지도 있어 믿고 사용할 수 있었다. ([공식 홈페이지](https://gorhom.github.io/react-native-bottom-sheet/))

![](./React-Native-bottom-modal.png)

## Installation

작성일 기준 설치방법이다.

```shell
yarn add @gorhom/bottom-sheet@^4
```

추가로 설치가 필요한 라이브러리가 있다.

- expo 사용하지 않는 경우
```shell
yarn add react-native-reanimated react-native-gesture-handler
```

- expo 사용하는 경우
```shell
expo install react-native-reanimated react-native-gesture-handler
```

ReactNative v0.63 이상을 사용한다면 Fabric 구조로 프로젝트가 구성되며 이 경우 `react-native-gesture-handler` v2.0 이상을 사용해야 한다.

### babel plugin

`babel.config.js` 파일 수정이 필요하다.

```js
  module.exports = {
    presets: [
      ...
    ],
    plugins: [
      ...
      'react-native-reanimated/plugin',
    ],
  };
```

### IOS

프로젝트 내부의 `ios` 폴더로 이동해 아래 명령어 실행

```shell
RCT_NEW_ARCH_ENABLED=1 pod install
```

### Android

추가 설정 필요 없음
