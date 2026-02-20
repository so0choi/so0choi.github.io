---
title: "yarn peer dependency 에러 바로잡기"
description: "yarn peer dependency 에러를 드디어 고쳐보자"
pubDate: 2026-02-20 10:17:07
category: frontend
tags:
  - Javascript
---

bitbucket pipeline으로 배포하려는데 자꾸 npm module 설치 과정에서 에러가 났다.

```shell
#19 [deps 5/5] RUN corepack enable && yarn install --immutable
#19 sha256:4b671f0d528e4b4f7b6d26eb577bd44a9feed94010ca26a3b69d39ef196a7917
#19 0.413 ! Corepack is about to download https://repo.yarnpkg.com/4.12.0/packages/yarnpkg-cli/bin/yarn.js
#19 1.714 ➤ YN0000: · Yarn 4.12.0
#19 1.740 ➤ YN0000: ┌ Resolution step
#19 2.244 ➤ YN0000: └ Completed in 0s 504ms
#19 2.245 ➤ YN0000: ┌ Post-resolution validation
#19 2.245 ➤ YN0086: │ Some peer dependencies are incorrectly met by dependencies; run yarn explain peer-requirements for details.
#19 2.311 ➤ YN0000: └ Completed
#19 2.312 ➤ YN0000: ┌ Fetch step
#19 ERROR: process "/bin/sh -c corepack enable && yarn install --immutable" did not complete successfully: exit code: 1
------
 > [deps 5/5] RUN corepack enable && yarn install --immutable:
------
process "/bin/sh -c corepack enable && yarn install --immutable" did not complete successfully: exit code: 1
```

패키지 버전 문제 같았는데 Claude의 도움을 받아 package.json에서 패키지 버전을 변경하고 다시 배포해봐도 똑같은 문제가 발생했다. 그래서 그냥 자세히 들여다보기로 했다.

## 문제 파악

일단 peer 패키지 버전들간에 문제가 있으면 `yarn install`만 실행해도 경고문이 뜬다.

```shell
$ yarn install                                          
➤ YN0000: · Yarn 4.12.0
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + eslint@npm:8.57.1, vite@npm:6.4.1, @eslint/js@npm:8.57.1, @humanwhocodes/config-array@npm:0.13.0, @humanwhocodes/object-schema@npm:2.0.3, @rollup/rollup-android-arm-eabi@npm:4.57.1, @rollup/rollup-android-arm64@npm:4.57.1, and 25 more.
➤ YN0085: │ - @eslint/js@npm:8.56.0, @humanwhocodes/config-array@npm:0.11.13, @humanwhocodes/object-schema@npm:2.0.1, eslint@npm:8.56.0
➤ YN0000: └ Completed in 0s 613ms
➤ YN0000: ┌ Post-resolution validation
➤ YN0086: │ Some peer dependencies are incorrectly met by dependencies; run yarn explain peer-requirements for details.   ---> 이 부분!
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0013: │ 8 packages were added to the project (+ 10.06 MiB).
➤ YN0000: └ Completed in 1s 604ms
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed in 1s 70ms
➤ YN0000: · Done with warnings in 3s 463ms
```

경고문에 나온 `yarn explain peer-requirements` 커맨드를 실행해보기로 했다.

```shell
yarn explain peer-requirements [hash]
```

이 명령어를 실행하면 peer dependency 목록이 전부 나온다. 해당 라이브러리에게 필요한 패키지 종속성이 모두 충족이 되었는지 한눈에 볼 수 있다. 자세한 정보를 보고 싶다면 뒤에 hash를 넣어서 실행하면 된다.

```
$ yarn explain peer-requirements

p34f033 → ✓ @humanwhocodes/config-array@npm:0.13.0 doesn't provide @types/supports-color to debug@npm:4.4.0 [84309]
pddabaa → ✓ @humanwhocodes/config-array@npm:0.13.0 doesn't provide supports-color to debug@npm:4.4.0 [84309]
p72e6c1 → ✓ @tanstack/eslint-plugin-query@npm:5.66.1 [ae591] doesn't provide @types/typescript to @typescript-eslint/utils@npm:8.24.1 [88c0d] and 2 other dependencies
pf4d1b1 → ✘ @tanstack/eslint-plugin-query@npm:5.66.1 [ae591] doesn't provide typescript to @typescript-eslint/utils@npm:8.24.1 [88c0d] and 2 other dependencies
p7a5712 → ✓ @typescript-eslint/parser@npm:6.18.1 [bc399] doesn't provide @types/supports-color to debug@npm:4.3.4 [1ff4b]
pb86aa2 → ✓ @typescript-eslint/parser@npm:6.18.1 [bc399] doesn't provide supports-color to debug@npm:4.3.4 [1ff4b]
```

가장 좌측에 있는 게 해시이고 문제가 없는 종속성은 초록 체크 표시가 나타나며 유심히 봐야할 부분은 빨간 x 아이콘이 나오는 부분이다.  
Claude가 버전을 수정했던 그 라이브러리가 문제가 있는 것으로 나왔다. hash를 입력해 다시 한번 실행해봤다.


```shell
$ yarn explain peer-requirements pf4d1b1 
Package @tanstack/eslint-plugin-query@npm:5.66.1 [ae591] is requested to provide typescript by its descendants

@tanstack/eslint-plugin-query@npm:5.66.1 [ae591]
└─ @typescript-eslint/utils@npm:8.24.1 [88c0d] (via >=4.8.4 <5.8.0)
   └─ @typescript-eslint/typescript-estree@npm:8.24.1 [e247d] (via >=4.8.4 <5.8.0)
      └─ ts-api-utils@npm:2.0.1 [13b03] (via >=4.8.4)

✘ Package @tanstack/eslint-plugin-query@npm:5.66.1 [ae591] does not provide typescript.
```

패키지 `@tanstack/eslint-plugin-query`은 `typescript`가 필요한데 직접 의존성으로 해당 패키지를 찾지 못해 문제가 발생한 것으로 보인다.

## 해결하기

.yarnrc.yml 파일에 명시저으로 의존성에 필요한 라이브러리를 추가했다.

```shell
packageExtensions:
  '@tanstack/eslint-plugin-query@*':
    dependencies:
      'typescript': '5.7'
```

`typescript` : '*'로 넣었더니 typescript 4.8.4와 5.8 사이 버전만 사용할 수 있어서 5.7로 넣엊놓았다. 이제 yarn install을 해도 아무 경고문 없이 잘 실행되었다.

yarn add를 하기는 쉬웠지만 시간이 지나고 패키지들이 계속 추가되면서 서로 버전이 꼬이는 경우가 발생하게 된다. 주기적으로 패키지 버전 관리를 잘 하는 것이 필요하다.

## 참고

- https://velog.io/@hoon0123/peerdependency-%EB%B0%95%EC%82%B4%EB%82%9C%EA%B1%B0-%ED%95%B4%EA%B2%B0%ED%95%B4%EC%95%BC%ED%95%B4
- https://yceffort.kr/2021/10/debt-of-package-json
