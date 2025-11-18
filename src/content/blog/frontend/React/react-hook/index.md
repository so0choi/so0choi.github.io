---
title: Reat hooks 정리
description: '사용할 때마다 틈틈이 정리해놓기 ✨ useMemo 리렌더링 과정에서 사용할 수 있는 캐싱 기법이다. 함수형 컴포넌트는 과정을 거쳐 렌더링되는데 이 때 내부 변수 초기화에 무거운 연산이 포함된 경우 성능이 저하될 것이다. 이런 경우 연산된 결과를 메모리에 저장해놓고 필요한 경우에 불러올 때 사용하는 것이 이다. useMe…'
pubDate: 2023-03-07 15:26:14
category: frontend



---


사용할 때마다 틈틈이 정리해놓기 ✨

## useMemo

리렌더링 과정에서 사용할 수 있는 캐싱 기법이다.

함수형 컴포넌트는 `렌더링 > 컴포넌트 함수 호출 > 내부 변수 초기화` 과정을 거쳐 렌더링되는데 이 때 내부 변수 초기화에 무거운 연산이 포함된 경우 성능이 저하될 것이다. 이런 경우 연산된 결과를 메모리에 저장해놓고 필요한 경우에 불러올 때 사용하는 것이 `useMemo`이다. useMemo를 사용하는 경우 의존성 배열에 들어있는 값에 변화가 있을 때만 재연산한다. 의존성 배열에 빈 배열이 들어오면 매 렌더링에 실행된다.

### 사용법
```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

