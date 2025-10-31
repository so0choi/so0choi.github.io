---
title: React 기본 내용 정리
description: '리액트 라이브러리를 설치함으로써 시작할 수 있다. 기본적으로 Node.js가 설치되어있어야 한다. 리액트 프로젝트를 처음부터 구성하는 것은 쉽지 않은 일이다. 리액트는 구성이 되어있는 프로젝트를 바로 시작하는 라이브러리를 가지고 있다. 아래 명령어로 간단하게 시작할 수 있다. 이때 를 사용하는 이유는 최신 리액트 버전을…'
pubDate: 2021-01-24 19:33:53
tags: React
category: ReactJS

---


리액트 라이브러리를 설치함으로써 시작할 수 있다. 기본적으로 Node.js가 설치되어있어야 한다.

## `create-react-app`

리액트 프로젝트를 처음부터 구성하는 것은 쉽지 않은 일이다. 리액트는 구성이 되어있는 프로젝트를 바로 시작하는 라이브러리를 가지고 있다. 아래 명령어로 간단하게 시작할 수 있다. 이때 `npx`를 사용하는 이유는 최신 리액트 버전을 사용하기 위해서이다. 공식 도큐먼트에서도 

```
npx create-react-app my-app
```

`my-app`은 디렉토리명이다. 현재 디렉토리에 폴더가 생성되어 리액트 프로젝트가 만들어진다.

## 리액트 구성

리액트는 '컴포넌트' 단위로 이루어져있다. 컴포넌트는 **함수형**과 **클래스형**으로 두 가지 방법으로 만들 수 있는데 최신 리액트는 함수형을 주로 사용한다고 한다. 함수형으로 전환되던 시기에는 많은 예시가 클래스형으로 이루어져 있었는데 이제 공식 도큐먼트의 예시도 함수형으로 되어있으며 이를 더 범용적으로 사용하는 추세로 보인다.

컴포넌트란 자체적인 로직과 형태를 갖춘 하나의 UI 덩어리라고 생각하면 된다. 아주 작은 버튼이 될 수도 있고 전체 페이지가 하나의 컴포넌트가 될 수도 있다. 컴포넌트는 변수의 이름은 항상 대문자로 시작해야 한다. 그렇게 해야만 리액트가 이를 컴포넌트로 인식하여 제대로 동작할 수 있다. 소문자와 구분짓는 이유는 HTML의 tag 이름과 구분하기 위해서이다.

```js
function Button() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <Button />
    </div>
  );
}
```

소문자 `button`은 HTML 태그로 인식하고, 대문자 `Button` 은 리액트 컴포넌트로 인식된다.

## jsx 문법

컴포넌트를 반환할 때에는 주로 `jsx`를 사용한다. 위의 코드처럼 꺽쇠(<>) 를 사용해 작성하는 문법을 jsx라고 한다. HTML과 비슷한 형태를 가지고있다. jsx 사용이 필수는 아니며 이를 사용하지 않고도 코드 작성이 가능하지만 편의를 위해서 사용하는 문법이다. jsx는 하나의 tag만 반환해야 하는 특징이 있다. 여러 개의 컴포넌트를 반환해야 하는 경우 `<div>` 로 묶거나 `<>` 이런 빈 태그로 묶어서 반환해야 한다.

```js
function AboutPage(){
    return (
        <>
            <h1>About</h1>
            <p>Hello there.<br />How do you do?</p>
        </>
    );
}
```

여기서 가장 바깥쪽의 `<>`를 없애면 한 가지 tag를 반환하지 않기 때문에 오류가 발생한다.

tag 사이에 작성한 텍스트는 일반 텍스트로 표시된다. JavaScript 변수를 화면에 표시하고 싶은 경우 `{}` 를 사용하면 된다. jsx 속성을 정의할 때도 중괄호를 이용하여 똑같이 사용할 수 있다.

```js
const user = {
    name: 'Hedy Lamarr',
    imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
    imageSize: 90,
};

export default function Profile() {
    return (
        <>
            <h1>{user.name}</h1>
            <img
                className="avatar"
                src={user.imageUrl}
                alt={'Photo of ' + user.name}
                style={{
                    width: user.imageSize,
                    height: user.imageSize
                }}
            />
        </>
    );
}

```

## style 입히기

jsx 엘리먼트의 style 적용 또한 HTML과 비슷하다. HTML은 `class`를 사용하지만 jsx는 `className`을 사용한다.

```js
<img className="avatar" />
```

## 참고

- [React JS document](https://beta.reactjs.org/)
