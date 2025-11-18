---
title: "[React Native] dotenv 사용하기"
description: 'dotenv를 쓰려고 추가하다가 생각지도 못하게 시간을 잡아먹어서 정리해놓으려고 한다. 모듈을 사용하면 된다. react native dotenv Installation react native dotenv 모듈을 다운받는다. Configuration 이 모듈은 babel plugin 이라 설정 파일에 추가해줘야 한다.…'
pubDate: 2022-02-25 13:46:59
category: mobile


---


dotenv를 쓰려고 추가하다가 생각지도 못하게 시간을 잡아먹어서 정리해놓으려고 한다. `react-native-dotenv` 모듈을 사용하면 된다.

## react-native-dotenv

### Installation

[react-native-dotenv](https://www.npmjs.com/package/react-native-dotenv) 모듈을 다운받는다.

```
yarn add react-native-dotenv
yarn add @types/react-native-dotenv
```

### Configuration

이 모듈은 babel plugin 이라 설정 파일에 추가해줘야 한다.

- babel.config.js

```js
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "react-native-dotenv",
        path: ".env",
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
```

이건 내가 설정한 옵션이고 기본 옵션은 아래와 같다.

```js
{
  "plugins": [
    ["module:react-native-dotenv", {
      "envName": "APP_ENV",
      "moduleName": "@env",
      "path": ".env",
      "blocklist": null,
      "allowlist": null,
      "blacklist": null, // DEPRECATED
      "whitelist": null, // DEPRECATED
      "safe": false,
      "allowUndefined": true,
      "verbose": false
    }]
  ]
}
```

README를 참조했을 때는 여기까지 하면 작동이 되어야 하는데 계속해서 `react-native-dotenv has no exported member` 오류가 발생했다. 서칭을 하다가 이 [이슈](https://github.com/zetachang/react-native-dotenv/issues/76#issuecomment-585171009)를 발견하고 참고해 해결했다.

### Create env.d.ts

root 위치에 'env.d.ts' 파일을 생성했다.

```js
declare module 'react-native-dotenv' {
  export const ANDROID_SDK_KEY: string;
  export const IOS_SDK_KEY: string;
}
```

## Usage

```js
import { ANDROID_SDK_KEY, IOS_SDK_KEY } from "react-native-dotenv";
```

이렇게 간단하게 사용할 수 있다! 🥲
