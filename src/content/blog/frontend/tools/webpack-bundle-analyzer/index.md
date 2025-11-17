---
title: Webpack Bundle Analyzer
description: '페이지 로드 속도는 매우 중요한 요소이다. 페이지 컨텐츠가 전부 그려지지 못하더라도 무언가 화면에 그려지는 first paint 작업은 최대한 빠르게 처리되어야 유저 이탈률이 줄어든다. webpack을 사용해 bundle을 페이지에 붙이는 경우 bundle의 사이즈가 페이지 성능에 큰 영향을 주게 된다. 따라서 bund…'
heroImage: './webpack-bundle-analyzer.gif'
pubDate: 2023-11-13 14:08:57
category: Frontend


---



페이지 로드 속도는 매우 중요한 요소이다. 페이지 컨텐츠가 전부 그려지지 못하더라도 무언가 화면에 그려지는 first paint 작업은 최대한 빠르게 처리되어야 유저 이탈률이 줄어든다.
webpack을 사용해 bundle을 페이지에 붙이는 경우 bundle의 사이즈가 페이지 성능에 큰 영향을 주게 된다. 따라서 bundle 사이즈를 관리하는 것이 매우 중요하다.
`Webpack Bundle Analyzer`를 사용해 webpack output 파일을 분석해 각 요소의 크기를 시각화하여 볼 수 있다. [Github: Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 페이지에서 자세한 사용 방법을 볼 수 있다. 

![webpack bundle analyzer](./webpack-bundle-analyzer.gif)

## 설치

```shell
# yarn
yarn add  -D webpack-bundle-analyzer
```

## 사용

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin(options?: object)
  ]
}
```

### 옵션

생성된 번들 분석 보고서를 html 파일로 열어주는데, 포트 설정 등 다양한 옵션을 제공한다. 기능에 영향을 크게 주는 옵션은 없어보이므로 필요한 경우 [webpack-bundle-analyzer README](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin)를 참고해서 사용하면 될 것 같다.

## 그 외

### 페이지 로드 성능 측정 사이트

https://pagespeed.web.dev/analysis

위 사이트에서 로드 속도를 측정하고자 하는 페이지의 링크를 입력하면 성능을 측정할 수 있다. 로드 속도 뿐만 아니라 로드 속도가 느린 원인 분석과 해결 방안 추천까지 해줘서 여러모로 도움이 되었다.

