---
title: yarn 전체 라이브러리 upgrade
description: 'yarn upgrade 에 명시된 버전 범위 내에서 패키지들을 업데이트 한다. 파일도 재생성된다. yarn upgrade latest 명령어가 실행되지만 에 명시된 버전 범위는 무시된다. yarn outdated 설치된 모든 패키지의 dependency를 리스팅한다. 현재 설치된 버전과 최소 요구 버전, 그리고 최신 버…'
pubDate: 2023-02-01 09:41:14
tags:

---


## yarn upgrade

`package.json`에 명시된 버전 범위 내에서 패키지들을 업데이트 한다. `yarn.lock` 파일도 재생성된다. 

### yarn upgrade --latest

`upgrade` 명령어가 실행되지만 `package.json`에 명시된 버전 범위는 무시된다.

> `yarn upgarde`를 사용할 경우 `package.json` 내용이 업데이트 되지 않는다.

## yarn outdated

설치된 모든 패키지의 dependency를 리스팅한다. 현재 설치된 버전과 최소 요구 버전, 그리고 최신 버전을 보여준다.

```shell
Package    Current Wanted Latest Package Type    URL
lodash     4.15.0  4.15.0 4.16.4 devDependencies https://github.com/lodash/lodash#readme
underscore 1.6.0   1.6.0  1.8.3  dependencies    https://github.com/jashkenas/underscore#readme
✨  Done in 0.72s.
```

## yarn upgrade-interactive

`yarn outdated`와 `yarn upgrade`가 합쳐진 명령어이다. 


## yarn-upgrade-all 패키지 사용

```shell
npx global add yarn-upgrade-all
```

