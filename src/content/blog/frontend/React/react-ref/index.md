---
title: "[React] ref 전달하기"
description: 'React에서 자식 컴포넌트에 ref를 전달하려고 하면 오류가 발생한다. 위 코드를 실행하면 의도한대로 동작하지 않는 것을 볼 수 있다. 이런식으로 가리키게 하려고 한 것이나 실패한다. warning은 다음과 같다. warning에도 나와있듯 이런 경우 를 사용해야한다. forwardRef 는 고차원 컴포넌트에서 ref…'
heroImage: './2023042001.png'
pubDate: 2023-04-20 13:18:38
category: frontend




---



React에서 자식 컴포넌트에 ref를 전달하려고 하면 오류가 발생한다.

```js
import { useRef, useEffect } from 'react'
export function Parent() {
  const elementRef = useRef()
  useEffect(() => {
    // Does not work!
    console.log(elementRef.current) // logs undefined
  }, [])
  return <Child ref={elementRef} /> // assign the ref
}
function Child({ ref }) { // a new component
  return <div ref={ref}>Hello, World!</div>
}
```

위 코드를 실행하면 의도한대로 동작하지 않는 것을 볼 수 있다.

![](./2023042001.png)

이런식으로 가리키게 하려고 한 것이나 실패한다. warning은 다음과 같다.

```
 Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```

warning에도 나와있듯 이런 경우 `forwardRef`를 사용해야한다.

## forwardRef

`foreardRef`는 고차원 컴포넌트에서 ref를 전달할 때 사용한다. ref를 전달받고자 하는 하위 컴포넌트를 `forwardRef`로 감싸면 된다.

```js
import { useRef, useEffect, forwardRef } from 'react'
export function Parent() {
  const elementRef = useRef()
  useEffect(() => {
    // Does not work!
    console.log(elementRef.current) // logs <div>Hello, World!</div>
  }, [])
  return <Child ref={elementRef} /> // assign the ref
}
const Child = forwardRef((props, ref) => {
    return <div ref={ref}>Hello, World!</div>  
})
```

`forwardRef` 컴포넌트는 첫번째 인자로 props를 받고 전달 받은 ref는 두 번째 인자로써 처리한다.

### Typescript에서 사용하기

Typescript에서는 타입지정 때문에 에러가 계속 발생했다.

```js
import { useRef, useEffect, forwardRef } from 'react'
export function Parent() {
  const elementRef = useRef()
  useEffect(() => {
    // Does not work!
    console.log(elementRef.current) // logs <div>Hello, World!</div>
  }, [])
  return <Child ref={elementRef} /> // assign the ref
}
const Child = forwardRef((props, ref) => {
    const hadler = () => {
        ref.current?.open();
    }
    return <button onClick={handler}></button>
})
```

이런 식으로 작성한 코드에서 `current` 부분에 계속 에러가 발생했다.

```
Property 'current' does not exist on type 'Ref'. Property 'current' does not exist on type '(instance: HTMLDivElement) => void'
```

구글링을 해보니 Ref가 항상 `current` 프로퍼티를 가지는 object 인 게 아니라서 발생하는 오류였다. Ref가 함수가 될 수도 있기 때문에 `ref.current` 구문에서 타입 에러가 발생하는 것이다. Stackoverflow에서 간단한 훅을 발견해서 나는 이렇게 해결했다.

- `useForwardRef`
```ts
const useForwardRef = <T,>(
  ref: ForwardedRef<T>,
  initialValue: any = null
) => {
  const targetRef = useRef<T>(initialValue);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === 'function') {
      ref(targetRef.current);
    } else {
      ref.current = targetRef.current;
    }
  }, [ref]);

  return targetRef;
};
```

- index.tsx
```tsx
import { useRef, useEffect, forwardRef } from 'react'
export function Parent() {
  const elementRef = useRef()
  useEffect(() => {
    // Does not work!
    console.log(elementRef.current) // logs <div>Hello, World!</div>
  }, [])
  return <Child ref={elementRef} /> // assign the ref
}

const Child = forwardRef((props, ref) => {
    const btnRef = useForwardRef<HTMLButtonElement>(ref);
    const hadler = () => {
        btnRef.current?.open();
    }
    return <button onClick={handler}>Button</button>
})
```

이런식으로 `current`를 문제 없이 사용할 수 있었다.

## 참고

- [Forwarding refs](https://ko.reactjs.org/docs/forwarding-refs.html)
- [React forwardRef](https://dmitripavlutin.com/react-forwardref/)
- [Using ref current in react forwardRef](https://stackoverflow.com/questions/62238716/using-ref-current-in-react-forwardref)
