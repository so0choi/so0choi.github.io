---
title: Webpack
description: 'Webpack이란 webpack 은 Javascript용 static module bundler이다. 한 개 이상의 entry points 를 통해 내부적으로 dependency graph를 만들어 모든 모듈을 번들링 시켜주어, 결과적으로 프로젝트에서는 한 개의 번들만 import 시키면 된다. 이게 webpack의 기…'
heroImage: './2021-11-11-14-05-33.png'
pubDate: 2021-11-15 11:36:27
tags:
  - webpack
category: frontend





---



## Webpack이란

![](./2021-11-11-14-05-33.png)

[**webpack**](https://webpack.js.org/)은 Javascript용 static module bundler이다. 한 개 이상의 *entry points*를 통해 내부적으로 dependency graph를 만들어 모든 모듈을 번들링 시켜주어, 결과적으로 프로젝트에서는 한 개의 번들만 import 시키면 된다. 이게 webpack의 기본 concept이다. 번들러는 webpack말고도 Gulp등.. 다양하게 있지만 가장 많은 기능을 가지고 있는 툴은 webpack인 듯 하다.

`webpack.config.js` 파일에서 번들 옵션을 설정 할 수 있다. 아래는 설정 파일에서 사용하는 주요 옵션들이다. [webpack option](https://webpack.js.org/configuration/#options) 여기를 보면 정말 다양한 옵션들이 있음을 확인할 수 있다.. 필요할 때 들어가서 참고하면 되겠다.

## 설치

yarn 이든 npm 이든 global로 설치 해줬다.

```
yarn global add webpack webpack-cli
```

### Core Concept

- Entry
  webpack이 어디서 dependency graph를 시작해야 할지 알려주는 파일(들)이다.

```js
module.exports = {
  entry: "./path/to/my/entry/file.js",
};
```

이렇게 entry file의 path로 하나만 지정해 줄 수도 있고, 아래 처럼 여러 파일을 넣을 수도 있다.

```js
module.exports = {
  entry: {
    entry1: "./path/to/my/entry/entry1.js",
    entry2: "./path/to/my/entry/entry2.js",
  },
};
```

여러 entry를 지정하는 경우 앞에 써준 'name'을 번들러 파일명에 사용 할 수 있다.

- Output
  bundling한 파일을 어디에 어떤 이름으로 저장할 지 알려주는 옵션

- Loaders
  webpack은 Javascript 파일과 JSON 파일만 알아먹는다. Loader는 webpack이 다른 종류의 파일들도 처리할 수 있도록 해준다. 예를들어 css, sass파일이나 png, gif등의 이미지 파일들을 처리하는데 필요하며 파일 형식에 따라 각기 다른 로더가 필요하다.

## 후기

이전에도 한 번 공부해보려고 했는데 진입장벽이 높아 빠른 시간에 프로젝트에 적용시킬 수 없을것같아 놓아버렸다. 🥲 이번엔 좀 더 간단한 프로젝트를 하게 되어 다시 한 번 도전해 봤는데 천천히 공부해보니 어느정도 사용은 할 줄 알게 됐다. 여느 기술이 그렇듯 한 번 쓸 줄 알고 난 뒤에는 그리 어렵지 않다. 아직 눈감고 할 수 있을 정도는 아니지만 필요한 작업들은 할 수 있게 되었다. 백번 문서만 읽는 것 보다 강의를 보는게 더 빠르게 이해하는데 도움이 되었다. [생활코딩 - webpack](https://opentutorials.org/module/4566) 길지 않으니 한 번 보면 도움이 된다.
