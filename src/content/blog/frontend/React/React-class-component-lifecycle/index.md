---
title: React class component lifecycle
description: '외부 라이브러리를 다운받아 쓰다보니 class 컴포넌트를 쓸 일이 있어서 한 번 정리하기로 했다. lifecycle 순서 DOM이 그려질 때 컴포넌트들은 아래의 순서로 생성되고 소멸한다. Mounting DOM에 인스턴스가 처음 생성될 때의 과정이다. 1. 2. static getDerivedStateFromProps(…'
pubDate: 2023-09-18 11:19:40
tags:
  - React
  - Class component
category: frontend




---


외부 라이브러리를 다운받아 쓰다보니 class 컴포넌트를 쓸 일이 있어서 한 번 정리하기로 했다.

## lifecycle 순서
DOM이 그려질 때 컴포넌트들은 아래의 순서로 생성되고 소멸한다.

> `Mounting` -> `Updating` -> `Unmounting`

### Mounting

DOM에 인스턴스가 처음 생성될 때의 과정이다.

1. `constructor()`
2. static getDerivedStateFromProps()
3. `render()`
4. componentDidMount()

이전에는 `componentWillMount()`, `componentWillReceiveProps()` 도 있었으나 이제는 레거시 기능으로써 새로 작성하는 코드에서는 쓰지 않는 것이 권장된다.

### Updating

`props`나 `state`에 갱신 작업이 발생할 때 일어난다. 즉 컴포넌트가 re-render 될 때 발생한다.

1. static getDerivedStateFromProps()
2. `shouldComponentUpdate()`
3. `render()`
4. `getSnapshotBeforeUpdate()`
5. `componentDidUpdate()`

### Unmounting

컴포넌트가 DOM에서 사라질 때 발생하는 이벤트이다.

1. `componentWillUnmoun()`

## Error Handling

렌더링 중 에러가 발생했거나 자식 컴포넌트의 생성자 실행 중 에러가 발생하면 실행된다.

- static getDerivedStateFromError()
- `componentDidCatch()`

## 참고
- [React.Component](https://legacy.reactjs.org/docs/react-component.html)
