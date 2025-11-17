---
title: 'webpack 빌드 속도 향상시키기'
description: 'webpack 빌드가 갑자기 너무 느려져서 개발 속도가 정체되었다. 최근 webpack 옵션을 바꾼 적이 있었는데 그 때문인가 하고 성능과 관련된 옵션들을 살펴보다 잘못 사용하고 있던 부분을 발견했다. devtool 옵션 devtool 옵션은 webpack의 소스맵 생성 여부를 제어한다. 나는 처음 생성할 때 되어있던…'
pubDate: 2023-08-31 15:19:46
tags: webpack
category: Else

---


webpack 빌드가 갑자기 너무 느려져서 개발 속도가 정체되었다. 최근 webpack 옵션을 바꾼 적이 있었는데 그 때문인가 하고 성능과 관련된 옵션들을 살펴보다 잘못 사용하고 있던 부분을 발견했다.

## devtool 옵션

devtool 옵션은 webpack의 소스맵 생성 여부를 제어한다. 나는 처음 생성할 때 되어있던 설정을 그대로 사용하고 있었는데 `eval-source-map` 이었던 걸로 기억한다. [webpack 공식 홈페이지](https://webpack.kr/configuration/devtool/)에 따르면, 해당 옵션의 build 속도는 가장 느리다고 나와있다. 

가이드를 따르면 production용으로는 `none`을 사용하고, 개발용으로는 `eval` 을 사용할 것을 추천하고 있다.

## babel-loader & ts-loader

js로 작성되어있던 프론트 코드들을 시간이 날 때마다 ts로 전환하고 있다. webpack에서 typescript를 사용하는 방법은 `babel-loader`를 사용하는 것과 `ts-loader`를 사용하는 방법 두 가지가 있다. 둘 중 한 가지만 사용하면 되는데 나는 두 가지를 모두 설정해놓아서 build 속도가 더 느렸던 것으로 예상된다. babel 7 이전에는 babel에 typescript 플러그인이 없었기 때문에 두 개의 로더를 함께 사용했던 것으로 보인다.

찾아보니 개발 중에는 ts-loader를 사용하고 배포 시에는 babel-loader를 사용하는 방식도 사용하는 것 같다. ts-loader는 babel-loader가 해주지 않는 타입체킹을 포함하기 때문에 build에 시간이 오래 걸리기 떄문이다. ts-loader의 느린 빌드 속도는 `transpileOnly: true` 와 `forkTsCheckerWebpackPlugin` 사용으로 극복이 가능하다. `transpileOnly: true` 옵션은 ts-loader의 타입체킹 작업을 제외하고 트랜스파일링만 진행하도록 하여 빌드 속도를 향상 시켜준다. 여기서 제외된 타입체킹 작업은 `forkTsCheckerWebpackPlugin`에서 별도의 프로세스에서 진행할 수 있다.

하지만 둘의 속도 차이가 크게 나지는 않는 것으로 보인다. 아직도 많이 남아있는 IE 유저들을 커버하기 위해서 나는 babel을 계속해서 사용해야 할 것 같다. 그래서 `@babel/preset-typescript`를 사용하기로 했다.

```js
module.exports = {
    devtool: process.env.NODE_ENV !== 'prod' ? 'eval' : false,
    target: ['web', 'es5'],
    // ...
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                minify: TerserPlugin.uglifyJsMinify,
                // `terserOptions` options will be passed to `uglify-js`
                // Link to options - https://github.com/mishoo/UglifyJS#minify-options
                terserOptions: {},
            }),
        ],
    },
    module: {
        test: /\.m?js$|\.m?ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                plugins: ['@babel/plugin-transform-modules-commonjs'],
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            corejs: {
                                version: 3,
                            },
                            useBuiltIns: 'usage',
                            targets: {
                                edge: '17',
                                firefox: '60',
                                chrome: '67',
                                safari: '11.1',
                                ie: '11',
                            },
                        },
                    ],
                    '@babel/preset-typescript',
                ],
            },
        }, 
    }
}
```

일단 이렇게 수정했는데 이전보다 빨라진 것 같긴하다. 자세히 보지는 못했는데 다른 설정도 잘못된 게 있을 수도 있다.
찾다보니 `vite`를 쓰면 문제가 훨씬 간단하게 해결된다는 말이 있던데 알아봐야 할 것 같다.

## 참고 
- [바벨과 타입스크립트의 아름다운 결혼](https://ui.toast.com/weekly-pick/ko_20181220)
- [웹팩 환경에서의 빌드 속도 개선기 - 1](https://velog.io/@baby_dev/%EC%9B%B9%ED%8C%A9-%EB%B9%8C%EB%93%9C%EC%86%8D%EB%8F%84-%EA%B0%9C%EC%84%A0%EA%B8%B0-feat.-%EC%86%8C%EC%8A%A4%EB%A7%B5-runtimeChunks-ts-loader)
