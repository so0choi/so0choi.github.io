---
title: React 모바일 디바이스 100vh 사용하기 
description: '브라우저는 정책이 시시때때로 바뀌어서 언제 에러가 발생할지 모른다. 모바일 디바이스의 경우 iPhone은 하단바 때문에 를 사용해 전체 화면에 적용하려고 하면 하단 부분이 잘리는 경우가 있다. 대부분 최신 브라우저에서 사용 가능한 속성이 새로 나왔다고는 하지만 나의 경우 잘 적용되지 않았다. 이를 해결해주는 라이브러리가…'
heroImage: './react-100vh.png'
pubDate: 2024-10-22 15:41:15
category: frontend




---



브라우저는 정책이 시시때때로 바뀌어서 언제 에러가 발생할지 모른다. 모바일 디바이스의 경우 iPhone은 하단바 때문에 `100vh`를 사용해 전체 화면에 적용하려고 하면 하단 부분이 잘리는 경우가 있다.

![](./react-100vh.png)

대부분 최신 브라우저에서 사용 가능한 `100dvh` 속성이 새로 나왔다고는 하지만 나의 경우 잘 적용되지 않았다. 이를 해결해주는 라이브러리가 있지 않을까 싶어 찾아봤는데 아니나 다를까 좋은 게 있었다.

## react-div-100vh

화요일에 확인했는데 주간 다운로드 수가 10만 정도 되는 것을 보고 써도 되겠구나 싶었다. 사용법은 매우 간단하다.

먼저 라이브러리르 설치한다.

```shell
yarn add react-div-100vh
```

그리고 사용하고 싶은 곳을 컴포넌트로 감싸주면 된다.

```js
import Div100vh from 'react-div-100vh'

const MyFullHeightComponent = () => (
  <Div100vh>
    <marquee>Look ma, no crop!</marquee>
  </Div100vh>
)
```

정말 간단하다. 진작 알았으면 좋았을 텐데.

## 참고
- [이미지 참조](https://www.sabhya.dev/handling-ios-safari-toolbar-for-full-height-web-content)
