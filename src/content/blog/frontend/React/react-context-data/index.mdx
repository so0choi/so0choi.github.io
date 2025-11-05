---
title: context로 global data 관리
description: 'React에서는 주로 parent 컴포넌트에서 child 컴포넌트로 를 이용해 데이터를 넘긴다. 이때 많은 데이터에서 공통적으로 필요로하는 데이터가 있다면 props를 통해 데이터를 넘기려면 불편하기도하고 비효율적이라는 생각이 든다. 이럴 때 사용할 수 있는 것이 이다. 직접적으로 props를 통해 데이터를 넘기지 않아…'
heroImage: './2023032001.png'
pubDate: 2023-03-20 14:46:19
category: React
tags:


---



React에서는 주로 parent 컴포넌트에서 child 컴포넌트로 `props`를 이용해 데이터를 넘긴다. 이때 많은 데이터에서 공통적으로 필요로하는 데이터가 있다면 props를 통해 데이터를 넘기려면 불편하기도하고 비효율적이라는 생각이 든다. 이럴 때 사용할 수 있는 것이 `Context`이다. 직접적으로 props를 통해 데이터를 넘기지 않아도 아무 컴포넌트에서나 접근이 가능하도록 하는 기능이다.

## Prop drilling

`props`를 통해 데이터를 전달하다보면 데이터가 직접 필요한 컴포넌트와 데이터를 처음에 가지고 있던 컴포넌트 사이에 거리가 먼 경우가 있다. 그 사이에 컴포넌트는 데이터가 필요하지 않음에도 계속해서 전달해야 하는데 이런 현상을 `prop drilling`이라고 한다.

![](./2023032001.png)

번거롭게 넘길 필요 없이 데이터를 아무데서나 쓸 수 있도록 할 때 사용할 수 있는 것이 `Context`이다.

## Context

`Context`를 사용하면 부모 컴포넌트에서 정의한 데이터를 모든 자식 컴포넌트에서 사용 할 수 있다. 
context를 사용에는 다음 세 가지 단계를 거친다. 

### context를 생성한다.

```js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

### 데이터가 필요한 컴포넌트에서 context를 사용한다.

```jsx
import { useContext } from 'react'
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
   const level = useContext(LevelContext);
   // ...
}
```

3. 데이터를 명시한 컴포넌트가 데이터를 제공한다.

```jsx
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

하위 컴포넌트 `level` 데이터를 전달하지 않아도 내부의 모든 컴포넌트에서 전달받은 데이터 값을 사용할 수 있다. 전달된 값이 없는 경우 default로 설정한 `1`을 사용하게 된다.

## 참고
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
