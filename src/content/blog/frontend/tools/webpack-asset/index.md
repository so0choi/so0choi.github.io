---
title: Webpack file-loader 경로 오류
description: 'Webpack file loader 경로 오류 문제 jpg, gif 등 이미지 파일 처리를 위해 검색을 하다보면 ’file loader’를 사용하는 방식이 가장 많이 뜬다. 나의 경우 강의를 듣고 따라하며 ’file loader’를 프로젝트로 적용시켰는데, JS 파일에서 import한 이미지는 제대로 넣어졌으나 css…'
heroImage: './2021-11-18-10-49-12.png'
pubDate: 2021-11-18 11:36:27
tags:
  - webpack
category: Frontend



---




## 문제

jpg, gif 등 이미지 파일 처리를 위해 검색을 하다보면 'file-loader'를 사용하는 방식이 가장 많이 뜬다. 나의 경우 강의를 듣고 따라하며 'file-loader'를 프로젝트로 적용시켰는데, JS 파일에서 import한 이미지는 제대로 넣어졌으나 css 파일에서 url()로 입력한 이미지는 경로가 맞지 않아 불러오지를 못했다.

파일 구조는 아래와 같았다.

```
public
 ┣ img
 ┣  ┣ img1.jpg
 ┣  ┣ img2.gif
 ┣ js
 ┗ css
```

file-loader를 사용하면서 option은 아래와 같이 입력했다.

```js
{
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[contenthash].[ext]',
            },
          },
        ],
      },
```

`publicPath` 옵션도 바꿔보고.. 여러가지를 변경해봤는데 계속해서 해결되지 않았다. 나는 'public/img' 폴더 내부에 있는 파일에 접근해야 하는데, public폴더 하위에 dummy file이 hash된 이름으로 생성되고 css에서 사용하는 url 링크는 이 dummy file을 참조했다. `name` 옵션에서 hash가 아닌 파일 원래 이름을 사용하도록 변경했음에도 hash된 이름의 dummy가 생성되는걸 보고 file-loader 문제가 아니구나... 싶었다. 🤔

## 해결

역시나 답은 공식문서에 있었다. stackoverflow 답변 중 생소한 코드가 있어서 참조 링크를 들어가보니, file-loader는 Webpack4에서 사용하는 방식이고, Webpack5 부터는 내장 모듈 사용을 권장한다는 내용이었다.

![](./2021-11-18-10-49-12.png)

file-loader 옵션 때문에 며칠동안 들어왔던 페이지인데.. 자세히 봤으면 진작 해결될 문제였다.

### Asset Modules

Asset Modules은 asset file(font, icon 등)을 추가 로더 없이 사용할 수 있도록 해주는 Webpack5에 새롭게 추가된 내장 모듈이다. 기존에 여러가지 로더로 사용되던 작업을 이 모듈 하나로 처리할 수 있다.

이전까지의 방식은 아래와 같았다.

- raw-loader: file을 string으로 읽기
- url-loader: file을 data URI로 번들링하기
- file-loader: file을 output diretory로 내보내기

나는 이미지 파일 처리를 위해 file-loader를 사용했던 것이다.
새로운 Asset Module은 다음과 같이 사용하면 된다.

- asset/resource: file-loader로 하던 작업에 사용. file을 내보내 URL을 제공
- asset/inline: url-loader로 하던 작업에 사용. asset의 URI를 내보낸다.
- asset/source: raw-loader로 하던 작업에 사용. asset을 소스코드로 내보낸다.
- asset: data URI로 내보낼 지 분할된 파일로 내보낼지 자동으로 선택한다. 이전에는 url-loader에서 size limit옵션을 통해 설정한 작업이다.

최종적으로 아래와 같이 변경하여 정상적으로 실행이 가능했다.

webpack.config.js

```js
module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
```

이렇게 하면 output 경로에 asset파일이 저장되는데, 저장되는 경로나 파일 이름은 바꾸고 싶다면 output.assetModuleFilename 옵션으로 변경할 수 있다.

```js
  output: {
    assetModuleFilename: 'img/[hash][ext][query]',
  },
```

## 참고

[Asset Modules](https://webpack.js.org/guides/asset-modules/)
