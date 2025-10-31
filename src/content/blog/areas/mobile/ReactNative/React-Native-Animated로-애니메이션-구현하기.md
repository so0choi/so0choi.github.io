---
title: React Native Animated로 애니메이션 구현하기
description: '란 React Native에서 애니메이션을 구현하기 위해 사용되는 라이브러리이다. Animated는 / 메소드를 사용해 시간에 따른 애니메이션 전환을 실행시킨다. 주요 개념 : 애니메이션을 입힐 컴포넌트에 대한 하나 이상의 style 속성 : 애니메이션을 업데이트 하는 메소드 이 때 애니메이션 value에 직접 접근해서…'
pubDate: 2023-02-21 16:54:14
tags:
category: React Native

---


`Animated`란 React Native에서 애니메이션을 구현하기 위해 사용되는 라이브러리이다. Animated는 `start`/`stop` 메소드를 사용해 시간에 따른 애니메이션 전환을 실행시킨다.

## 주요 개념
- `Animated.Value`: 애니메이션을 입힐 컴포넌트에 대한 하나 이상의 style 속성
- `Animated.timing()`: 애니메이션을 업데이트 하는 메소드

이 때 애니메이션 value에 직접 접근해서는 안된다. `useRef` 훅을 써서 mutable ref를 사용하도록 한다. 

## 사용 예
avaa
```js
const App = () => {
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            // Bind opacity to animated value
            opacity: fadeAnim,
          },
        ]}>
        <Text style={styles.fadingText}>Fading View!</Text>
      </Animated.View>
      <View style={styles.buttonRow}>
        <Button title="Fade In View" onPress={fadeIn} />
        <Button title="Fade Out View" onPress={fadeOut} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fadingContainer: {
    padding: 20,
    backgroundColor: 'powderblue',
  },
  fadingText: {
    fontSize: 28,
  },
  buttonRow: {
    flexBasis: 100,
    justifyContent: 'space-evenly',
  },
});

export default App;
```

## 사용법

`Animated`는 두 가지 값으로 사용이 가능하다.
- `Animated.Value()` : 1개 값
- `Animated.ValueXY()` : vector 값

### 애니메이션 타입

총 세 가지의 애니메이션 타입이 제공된다. 각 타입은 애니메이션을 제어 할 수 있는 속성을 가지고있다.
- `Animated.decay()` : 초기 속도에서 서서히 줄어들어 멈추게 함
- `Animated.spring()` : 스프링 형태의 모델을 만들어 줌
- `Animated.timing()` : `easing` 함수를 사용해 시간 경과에 따라 값을 전환 시킴

가장 자주 사용되는 것은 `timing()` 이다. default 값으로 `easeInOut` 설정이 되어있다. 애니메이션이 천천히 시작해서 천천히 끝나는 형태이다.

### 애니메이션 실행하기

애니메이션은 `start()` 함수를 호출함으로써 실행시킨다. start는 애니메이션을 완료 후 실행시킬 수 있는 callback을 인자로 받는다. 애니메이션이 정상적으로 종료 되었다면, `{finished: true}`와 함께 callback을 실행시킨다. 만약 애니메이션이 `stop()`으로 인해 정상 종료되지 않았다면 `{finished: false}`를 가지고 callback이 실행된다.

> native drive 옵션을 설정하면 애니메이션을 실행시키기 전에 애니메이션에 대한 모든 정보를 native driver로 보내게 된다. 이렇게 하면 애니메이션의 각 프레임마다 bridge를 통과할 필요가 없기 때문에 성능이 향상된다. 애니메이션이 한 번 실행되면 애니메이션에 영향을 미치지 않으면서 JS 스레드의 block이 가능하다.

### 애니메이션 적용 가능한 컴포넌트

- `createAnimatedComponent()` 를 사용하면 컴포넌트를 애니메이션 적용 가능하도록 만들 수 있다.

또한 `Animated`는 위의 wrapper를 이용해 만들어진 컴포넌트들을 가지고 있다.
- `Animated.Image`
- `Animated.ScrollView`
- `Animated.Text`
- `Animated.View`
- `Animated.FlatList`
- `Animated.SelectionList`

## 참고
- [React Native Document - Animated](https://reactnative.dev/docs/animated)
