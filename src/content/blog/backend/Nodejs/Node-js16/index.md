---
title: "[Node.js] operation not permitted 오류"
description: 'Operation not permitted 실행 중 위와 같은 오류가 발생했다. 이 작업을 하기 전 다른 프로젝트의 security issue들을 해결하기 위해 몇가지 스크립트를 실행하다가 오류가 났었는데 그 작업중에 npm에 문제가 생긴것 같다. 여기서 해결법을 찾아냈다. 1. cache clean 2. 최신 버젼 n…'
heroImage: './2020-10-04-16-09-27.png'
pubDate: 2020-10-04 16:08:04
tags: 
  - Node.js
  - Error
category: backend





---



# Operation not permitted

![](./2020-10-04-16-09-27.png)

`npm install` 실행 중 위와 같은 오류가 발생했다.

이 작업을 하기 전 다른 프로젝트의 security issue들을 해결하기 위해 몇가지 스크립트를 실행하다가 오류가 났었는데 그 작업중에 npm에 문제가 생긴것 같다.

> [Stackoverflow](https://stackoverflow.com/questions/39293636/npm-err-error-eperm-operation-not-permitted-rename)

여기서 해결법을 찾아냈다.

1. cache clean

```
npm cache clean --force
```

2. 최신 버젼 npm 설치

```
npm install -g npm@latest --force
```

3. cache clean

```
npm cache clean --force
```

4. 오류 났던 작업 다시 실행해보기

나느 이 방법으로 해결 할 수 있었다. 만약 문제가 해결되지 않는다면 백신 프로그램을 끄고 실행해보라고 한다.
