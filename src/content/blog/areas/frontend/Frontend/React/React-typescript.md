---
title: React typescript type 지정하기
description: '각종 리액트 변수 및 함수들을 파라미터로 넘기려는 데 type을 알 수 없어서 몇 번 검색하다가 자주쓰는 건 정리해놓기로 했다. setState onClick Event Handler onClick Event onChange Event Handler'
pubDate: 2023-09-27 09:18:15
tags: Typescript
category: React

---


각종 리액트 변수 및 함수들을 파라미터로 넘기려는 데 type을 알 수 없어서 몇 번 검색하다가 자주쓰는 건 정리해놓기로 했다.  

## setState

- `React.Dispatch<React.SetStateAction<any>>`

```ts
const funcA = (setStateParam: React.Dispatch<React.SetStateAction<string>>) => {
    // something
}
```

## onClick Event Handler

- `MouseEventHandler<HTMLButtonElement>`

```ts
const funcB = (onClick: MouseEventHandler<HTMLButtonElement>) => {
    // something
}
```

## onClick Event

- `React.MouseEvent`

```ts
const onClickHandler = (e: React.MouseEvent, command: string) => {
    // something
}
```

## onChange Event Handler

- `ChangeEventHandler<HTMLInputElement>`

```ts
const onChange: ChangeEventHandler<HTMLInputElement> = () => {
    // something
}
```
