---
title: React Native 절대경로 설정
description: '점점 더 지저분해지는 import 경로를 도저히 볼 수 없어서 절대경로를 추가하기로 했다. 우우.. 👎 리팩토링을 진행하면서 컴포넌트를 더 잘게 쪼개다보니 path level이 너무 깊어졌다. 이대로는 안되겠다 싶었다. 적용 방법 babel plugin module resolver를 설치한다. 프로젝트 root 경로에…'
pubDate: 2023-10-06 16:04:31
category: mobile


---


점점 더 지저분해지는 import 경로를 도저히 볼 수 없어서 절대경로를 추가하기로 했다.

```ts
import Logo from '../../../../../assets/images/logo.svg';
```

우우.. 👎 리팩토링을 진행하면서 컴포넌트를 더 잘게 쪼개다보니 path level이 너무 깊어졌다. 이대로는 안되겠다 싶었다.

## 적용 방법

[babel-plugin-module-resolver](https://www.npmjs.com/package/babel-plugin-module-resolver)를 설치한다.

```shell
yarn add --dev babel-plugin-module-resolver
```

프로젝트 root 경로에 있는 `babel.config.js` 파일을 열어 아래와 같이 수정한다.

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
      // other plugins...
    [ 
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@assets': './src/assets',
          '@constants': './src/constants',
          '@contexts': './src/contexts',
          '@hooks': './src/hooks',
          '@interfaces': './src/interfaces',
          '@styles': './src/styles',
        },
      },
    ],
  ],
};
```

이렇게만 하면 적용된다. 서버를 재시작 후에도 에러가 발생한다면 `yarn start:development --reset-cache`로 캐시를 지우고 실행해보자.



