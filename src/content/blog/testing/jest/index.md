---
title: Jest 경로 에러
description: '테스트 코드를 실행하려고하는데 아래와 같은 에러가 발생했다. 서치를 좀 하다가 Jest 설정을 수정했는데 아래와 같은 에러도 발생했다. 결론적으로는 같은 원인으로 발생한 문제였다. 해결법 파일의 Jest 설정을 바꿔주면 된다. 참고 How to fix the ‘Cannot find module’ when importin…'
pubDate: 2022-07-21 11:29:48
category: testing
tags: 
  - Jest
  - Error




---


테스트 코드를 실행하려고하는데 아래와 같은 에러가 발생했다.

```
> Cannot find module 'src/config/configFile' from 'modules/foo/foo.service.ts'
```

서치를 좀 하다가 Jest 설정을 수정했는데 아래와 같은 에러도 발생했다.
결론적으로는 같은 원인으로 발생한 문제였다.

```
> TypeError: Right-hand side of 'instanceof' is not an object
> 30 |
> 31 | constructor(
> 32 | @InjectRepository(ChannelPlayer)
```

## 해결법

`package.json` 파일의 Jest 설정을 바꿔주면 된다.

```js
"jest": {
  "roots": [
    "<rootDir>",
    "/home/some/path/"
  ],
  "modulePaths": [
    "<rootDir>",
    "/home/some/other/path"
  ],
  "moduleDirectories": [
    "node_modules"
  ],
}
```

## 참고

- [How to fix the ‘Cannot find module’ when importing components with absolute paths with Jest?](https://thewebdev.info/2022/03/04/how-to-fix-the-cannot-find-module-when-importing-components-with-absolute-paths-with-jest/)
