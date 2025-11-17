---
title: React Native New Architecture
description: 'React Native는 버전 0.68부터 새로운 구조를 도입했다. 새로운 구조는 기존 구조에 있던 RN의 고질적인 성능 이슈를 해결했다. 하지만 기존 구조를 바탕으로 만들어진 라이브러리가 많기 때문에 기존의 프로젝트를 마이그레이션 하는 것은 충분히 고려해 본 다음 진행해야 할 것 같다. Old Architecture…'
heroImage: './React-Native-New-Architecture-01.png'
pubDate: 2023-07-11 10:16:50
tags:
category: React Native


---



React Native는 버전 0.68부터 새로운 구조를 도입했다. 새로운 구조는 기존 구조에 있던 RN의 고질적인 성능 이슈를 해결했다. 하지만 기존 구조를 바탕으로 만들어진 라이브러리가 많기 때문에 기존의 프로젝트를 마이그레이션 하는 것은 충분히 고려해 본 다음 진행해야 할 것 같다.

## Old Architecture

![](./React-Native-New-Architecture-01.png)

React Native는 크로스 플랫폼 애플리케이션을 개발하게 해준다. 이 말은 즉 각 OS의 Native 계층에 직접적으로 접근하지 않는다는 것이다. 그러므로 개발자가 작성한 JS 코드를 Native 세계에서 이해할 수 있도록 하는 별도의 과정이 필요했다. 기존의 구조에서는 JS로 작성된 모든 데이터가 serialize 과정을 거쳐 *Bridge* 라고 하는 컴포넌트를 통해 네이티브 레이어로 전달된다. Bridge를 일종의 '버스'라고 생각해 볼 수 있겠다. 전달받은 데이터는 deserialize 되어 데이터를 읽어 필요한 동작들이 실행된다. React Native에서 사용한 UI Componenet들이 각 OS에서 사용되는 Component로 변환되는 작업이다.

### Core component
|REACT NATIVE UI COMPONENT |ANDROID VIEW | IOS VIEW|WEB ANALOG| DESCRIPTION                                      |
|---|---|---|----|--------------------------------------------------|
|`<View>`|`<ViewGroup>`|`<UI View>`|A non-scrolling `<div>`| flexbox의 특징과 style을 가지며 몇 가지 터치 제스처 핸들링을 가진 컨테이너 |
|`<Text>`|`<TextView>`|`<UITextView>`|`<p>`| 텍스트. 몇 가지 터치 이벤트 핸들러를 가지는 컴포넌트                   |
|`<Image>`|`<ImageView>`|`<UIImageView>`|`<img>`| 이미지 컴포넌트                                         |
|`<ScrollView>`|`<ScrollView>`|`<UIScrollView>`|`<div>`| 스크롤 가능한 컨테이너                                     |
|`<TextInput>`|`<EditText>`|`<UITextField>`|`<input type="text">`| 유저에게서 텍스트를 입력받는 컴포넌트                             |

### 3개의 주요 스레드

기존 구조를 크게 보면 세 개의 주 스레드가 있다.

1. Main / Native / UI thread: UI 컴포넌트가 렌더링되고 native 코드가 실행되는 스레드.
2. Layout thread / Shadow thread: 백그라운드에서 실제 레이아웃을 계산하는 데 사용됨. 페이스북에서 만든 레이아웃 엔진 **Yoga**를 사용해 flexbox 레이아웃을 계산하는 스레드
3. Javascript thread: JS 코드를 컴파일하고 실행하는 스레드.

![](./React-Native-New-Architecture-02.png)

### Bridge 구조의 단점

Bridge에는 몇 가지 단점이 있다.
- 비동기성: Bridge로 전달된 데이터는 그 동작이 수행될 때 까지 비동기적으로 기다린다. 기다릴 필요가 없을 경우에도 대기하기 때문에 성능 이슈가 생긴다.
- 싱글 스레드성: JS는 싱글 스레드로 동작하다. 그러므로 실제 실행 또한 싱글 스레드 환경에서 수행되어야 한다.
- 그 외 오버헤드들: 한 레이어가 다른 레이어로 데이터를 보낼 때 마다 데이터는 serialize와 deserialize 과정을 반복하게 된다. 이 경우 사용되는 포맷으로 단순함과 사람이 읽을 수 있다는 특성에 기반해 JSON을 사용하지만 경량화 되었음에도 이런 과정에서 오버헤드가 발생한다.

## New Architecture

새 구조에서는 성능을 떨어뜨리는 데 주 원인이 되었던 *Bridge* 개념이 사라졌다. 그 대신 *JSI(JavaScript Interface)*라는 새로운 통신 매커니즘이 도입된다. JSI는 JS 오브젝트가 C++을 참조 할 수 있도록 해주는 인터페이스이다. 참조가 가능하다는 것은 다시 말해 서로가 서로의 메소드를 직접 실행하는 것이 가능해진다는 것이다. C++가 JavaScript 세상에 있는 코드를 실행할 수 있고 그 반대도 가능하다.

### 장점

JSI의 도입으로 인해 따라오는 장점들이 있다.

- 동기성: 더이상 비동기적으로 다른 작업이 끝날 때 까지 기다릴 필요 없이 동기적으로 실행할 수 있게 되었다.
- 동시성: JavaScript가 다른 스레드에서 다른 함수를 실행 할 수 있게 되었다.
- 적은 오버헤드: 새로운 구조에서는 serialize/deserialize 작업이 사라졌기 때문에 오버헤드가 줄어든다.
- Code sharing: C++가 도입되면서 모든 플랫폼 독립적 코드를 추상화하여 플랫폼 간 code sharing이 쉬워졌다.
- 타입 안정성: JS가 C++ 오브젝트를 잘 실행시키도록 하기 위해 JS가 제대로 작성되었는 지 확인하기 위해 TypeScript 기반의 코드를 바탕으로 만들어지는 코드 layer가 추가되었다. 이로인해 타입 안정성을 가지게 된다.

새 구조는 React Native의 새로운 모듈 시스템(Turbo Modules)의 근간이 되었으며 더 빠르고 좋은 성능을 보이는 새로운 렌더러 Fabric을 사용하는 것도 가능해졌다.

![](./React-Native-New-Architecture-03.png)

## Fabric

React Native의 새로운 렌더러이다. 더 효율적으로 섀도우 트리를 생성한다. 레거시 렌더링 시스템에서 진화된 버전으로, C++과 직접적 통신을 함으로써 호스트 플랫폼과의 상호운용성을 더 높였다. Facebook에서 사용되는 React Native는 새로운 렌더러를 사용하는 것으로 전환되었다. Fabric을 도입함으로써 더 나은 UX를 제공할 수 있게 되었고 레거시 구조에서는 할 수 없었던 동작들이 지원 가능해졌다. 자세한 내용은 [공식 문서](https://reactnative.dev/architecture/fabric-renderer)를 참조하면 좋을 것 같다. 'Fabric'이라는 명칭이 공식 명칭이 아니라는 말도 있는데 이 부분은 잘 모르겠다. 

## Pillars Turbo Native Modules

기존의 구조에서는 네이티브 모듈을 React Native에서 사용하기 위해 `Native Modules`라는 개념을 사용했다. platform-native 코드와 JavaScript 가 Bridge를 통해 서로 소통 할 수 있도록 하는 개념이다. `Turbo Native Modules`는 Native Modules의 발전된 버전이다.

- 안정적인 타입이 적용된 인터페이스
- C++ 코드를 작성해줌. (플랫폼 별 언어에 맞춰 따로 구현 할 필요가 없어짐)
- 모듈의 lazy loading이 가능해져서 앱 실행이 빨라짐
- JSI를 사용해 bridge를 사용할 때 보다 JS 코드와 native 간 통신이 빨라짐

더 자세한 내용은 [공식 문서](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)를 참조하면 좋을 것 같다.

## 참고

- [Why a New Architecture](https://reactnative.dev/docs/the-new-architecture/why)
- [React Native new architecture old vs new](https://javascript.plainenglish.io/react-native-new-architecture-old-vs-new-d0130f42bc79)
