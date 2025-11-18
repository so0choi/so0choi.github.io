---
title: React에서 setInterval 사용하기
description: 'React에서 를 사용했는데 설정한 것 보다 여러번 실행되었다. 문제를 찾아보니 컴포넌트가 리로드 될 때마다 hook으로 감싸지지 않은 코드들이 재실행되기 때문이었다. 예를들어 아래와 같이 코드를 작성하는 경우에 그렇게 된다. 원하는 대로 동작하게 하려면 훅으로 감싸주면 된다. 또한 컴포넌트가 unmount 되었을 때…'
pubDate: 2023-09-21 10:16:31
category: frontend


---


React에서 `setInterval`를 사용했는데 설정한 것 보다 여러번 실행되었다. 문제를 찾아보니 컴포넌트가 리로드 될 때마다 hook으로 감싸지지 않은 코드들이 재실행되기 때문이었다.

예를들어 아래와 같이 코드를 작성하는 경우에 그렇게 된다.

```js
import React, {useState} from 'react';
import AppRouter from './Router';
import {authService} from '../fbase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  console.log(authService.currentUser);
  setInterval(() => {
    console.log(Date().toLocaleString());
    console.log('In App.js > App()');
    console.log(authService.currentUser);
  }, 5000);
  return <AppRouter isLoggedIn={isLoggedIn}></AppRouter>;
}

export default App;
```

원하는 대로 동작하게 하려면 `useEffect()` 훅으로 감싸주면 된다.

```js
useEffect(() => {
  setInterval(() => {
    // ...
  }, 5000)
), []}
```

또한 컴포넌트가 unmount 되었을 때 `setInterval` 함수가 단독으로 실행되는 것을 방지하기 위해서 `useEffect()` 함수의 return 값으로 `clearInterval()`를 실행하는 것이 좋다.

```js
useEffect(() => {
  const interval = setInterval(() => {
    ...
  }, 5000)

  return () => clearInterval(interval);
), []}
```

