---
title: Webpack loader 사용하기
description: 'Webpack Loader Webpack은 기본적으로 자바스크립트 번들러이기 떄문에 다른 형식의 파일을 번들링 하기 위해서는 loader 가 필요하다. 예를들면 css, sass, jpg.. 등 정적 asset들을 처리할 수도 있다. 또한 파일을 파일을 pre process하는 것도 가능하다. 사용 방법 webpack.…'
pubDate: 2021-11-18 11:16:27
tags:
  - webpack
category: frontend




---


# Webpack - Loader

Webpack은 기본적으로 자바스크립트 번들러이기 떄문에 다른 형식의 파일을 번들링 하기 위해서는 **loader**가 필요하다. 예를들면 css, sass, jpg.. 등 정적 asset들을 처리할 수도 있다. 또한 파일을 파일을 pre-process하는 것도 가능하다.

## 사용 방법

webpack.config.js에서 로더를 설정할 수 있다.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // 로더를 적용시킬 파일. 정규식 사용
        use: [{ loader: "style-loader" }, { loader: "css-loader" }], // 사용할 로더. 순서 맞춰서 입력
      },
      { test: /\.ts$/, use: "ts-loader" },
    ],
  },
};
```

어떻게 써야하는지 한 눈에 알 수 있다. `module.rules` 배열에 사용하고자 하는 로더를 추가하면 된다. 로더는 오른쪽에서 왼쪽 순으로 (또는 밑에서 위로) 실행된다. 즉 위 예시에서는 `ts-loader`가 `css-loader`보다 먼저 실행될 것이다. 순서가 맞지 않으면 번들링에 문제가 발생하는 로더들이 있으니 순서에 유의해야 한다.

예를 들어 css파일을 처리할 때 흔히 사용되는 'style-loader'와 'css-loader'를 사용할 때 'css-loader'는 css 파일을 읽어 `@import` 나 `url()` 등의 구분을 `import/require()`로 교체하는 전처리 작업을하는 로더이고 'style-loader'는 DOM에 css style은 inject 시켜주는 로더다. 따라서 css-loader, style-loader 순으로 실행되도록 순서를 맞춰주지 않으면 오류가 발생한다.

## babel-loader

가장 흔히 쓰이는 babel-loader에 대해서만 정리하려고 한다. webpack으로 babel을 적용시키는 로더다.

#### 설치

```bash
yarn add @babel/core @babel/preset-env -D
```

#### 사용

```js
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    },
  ];
}
```

이때 JS 코드에 'async/await'이 있을 경우 에러가 발생한다. 추가 플러그인을 설치해야 한다.

```bash
yarn add @babel/plugin-transform-runtime -D
yarn add @babel/runtime
```

플러그인 설치 후, babel-loader `options.plugins`에 추가 시키면 된다.

```js
options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
```

## 참고

[Webpack 공식 사이트](https://webpack.js.org/)
