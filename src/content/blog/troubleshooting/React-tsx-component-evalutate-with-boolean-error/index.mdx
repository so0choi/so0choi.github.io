---
title: "Type 'false | Element' is not assignable to type 'ReactElement<any, string | JSXElementConstructor<any>> | ComponentType<any> | null | undefined'."
description: '에러가 발생했던 코드는 아래와 같다. 이 구문은 를 사용하는 inline logical 구문이다. React 공식 문서에서도 찾아볼 수 있다. 코드에 빨간 줄이 뜨긴 하지만 실행은 정상적으로 된다. React는 false를 만난 순간 그 뒤에 나온 코드를 무시하기 때문에 원하는대로 동작하게 할 수 있으나 Typescri…'
pubDate: 2023-03-27 09:12:57
category: Error
tags: React

---


에러가 발생했던 코드는 아래와 같다.

```tsx
export default function EventListScreen() {
    return (
        <FlatList
            // .....
            ListEmptyComponent={
                !eventList.length && (
                    <Text>생성된 이벤트가 없습니다.</Text>
                )
            }
            // ....
        />
    )
}
```

이 구문은 `&&`를 사용하는 inline logical 구문이다. [React 공식 문서](https://legacy.reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator)에서도 찾아볼 수 있다. 코드에 빨간 줄이 뜨긴 하지만 실행은 정상적으로 된다.
React는 false를 만난 순간 그 뒤에 나온 코드를 무시하기 때문에 원하는대로 동작하게 할 수 있으나 Typescript 관점에서는 `boolean && expression` 이기 때문에 TS 오류가 발생한다.
가장 쉽게 해결할 수 있는 방법은 conditional logic 전체를 React element로 감싸는 방법이다.

```tsx
export default function EventListScreen() {
    return (
        <FlatList
            // .....
            ListEmptyComponent={
                <>
                    {!eventList.length && (
                        <Text>생성된 이벤트가 없습니다.</Text>
                    )}
                </>
            }
            // ....
        />
    )
}
```


## 참고 
- [stackoverflow](https://stackoverflow.com/questions/62612062/ts2322-false-element-is-not-assignable-to-type-reactelement-error-does-not)
