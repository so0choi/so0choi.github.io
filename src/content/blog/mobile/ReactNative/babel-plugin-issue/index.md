---
title: "[React Native] babel plugin config 이슈"
description: 'IOS 15 업데이트가 나오고 시뮬레이터에서 하도 많은 오류를 보다보니 어떤 오류가 나도 다 xCode 때문일 거라고 생각했다. 그래서 이 요상한 에러로 하루를 날려버렸다 🙀 에러 이런 에러가 떴는데 에러 앞쪽에 Babel이 보였던걸로 보아 babel config 문제가 발생한것 같았다. 내 프로젝트에 추가된 babe…'
pubDate: 2021-11-18 11:22:47
tags:
  - Babel
category: React Native

---


IOS 15 업데이트가 나오고 시뮬레이터에서 하도 많은 오류를 보다보니 어떤 오류가 나도 다 xCode 때문일 거라고 생각했다. 그래서 이 요상한 에러로 하루를 날려버렸다 🙀

## 에러

```
error: index.js: .plugins[0][1] must be an object, false, or undefined
```

이런 에러가 떴는데 에러 앞쪽에 Babel이 보였던걸로 보아 babel config 문제가 발생한것 같았다.
내 프로젝트에 추가된 babel plugin은 `module-resolver`, `babel-plugin-styled-components` 요 두가지였다.

babel.config.js

```js
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "babel-plugin-styled-components",
      "module-resolver",
      {
        root: ["./src"],
        extensions: [
          ".ios.ts",
          ".android.ts",
          ".ts",
          ".ios.tsx",
          ".android.tsx",
          ".tsx",
          ".jsx",
          ".js",
          ".json",
        ],
        alias: {
          "@": "./src",
          "@components": "./src/components",
          "@containers": "./src/containers",
          "@modules": "./src/modules",
          "@utils": "./src/utils",
          "@common": "./src/common",
        },
      },
    ],
  ],
};
```

config 파일은 이런상태였다.

## 해결

역시 공식 도큐먼트만 잘 읽어보면 에러가 생길 일이 없다.

[Babeljs.io - Plugin Options](https://babeljs.io/docs/en/plugins#plugin-options)

plugins나 presets는 옵션 object를 플러그인의 이름과 함께 []로 묶어 설정할 수 있다.

```js
{
  "plugins": ["pluginA", ["pluginA"], ["pluginA", {}]]
}
```

따라서 이 세가지 설정은 모두 같은 의미를 가진다.
plugin을 추가하면서 의미도 모르고 붙여넣기를 하다가 생긴 문제였다.
아래와 같이 수정했다.

```js
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "babel-plugin-styled-components",
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [
          ".ios.ts",
          ".android.ts",
          ".ts",
          ".ios.tsx",
          ".android.tsx",
          ".tsx",
          ".jsx",
          ".js",
          ".json",
        ],
        alias: {
          "@": "./src",
          "@components": "./src/components",
          "@containers": "./src/containers",
          "@modules": "./src/modules",
          "@utils": "./src/utils",
          "@common": "./src/common",
        },
      },
    ],
  ],
};
```

수정후 정상 빌드 되었다.
