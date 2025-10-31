---
title: React Native Xcode archive 실패 - Operation not permitted
description: 'Archieve를 진행하려고 하는데 계속해서 에러가 발생했다. 권한 관련 문제 같아서 설정에서 디스크 접근 권한을 XCode, watchman, webstorm, terminal에 전부 접근 허용을 줘봤는데도 해결이 되지 않았다. 그러다가 watchman 깃허브 이슈에서 요상한 해결책을 찾았다. 디렉토리 내부에 있으면…'
heroImage: '../../../../../assets/posts/React-Native-Xcode-archive-실패-Operation-not-permitted/2023040401.png'
pubDate: 2023-04-04 11:06:23
category: Error
tags: React Native


---



Archieve를 진행하려고 하는데 계속해서 에러가 발생했다.

```
jest-haste-map: Watchman crawl failed. Retrying once with node crawler. Usually this happens when watchman isn't running. Create an empty .watchmanconfig file in your project's root folder or initialize a git or hg repository in your project. Error: Watchman error: std::__1::system_error: open: /Users/sychoi/Desktop/Project/MyProject: Operation not permitted. Make sure watchman is running for this project. See https://facebook.github.io/watchman/docs/troubleshooting.
```

권한 관련 문제 같아서 설정에서 디스크 접근 권한을 XCode, watchman, webstorm, terminal에 전부 접근 허용을 줘봤는데도 해결이 되지 않았다. 그러다가 watchman 깃허브 이슈에서 요상한 해결책을 찾았다.

![](../../../../../assets/posts/React-Native-Xcode-archive-실패-Operation-not-permitted/2023040401.png)

`Documents` 디렉토리 내부에 있으면 안된다는 걸 보고 `Desktop`에 들어있던 프로젝트 폴더를 `Users/사용자명/` 경로로 빼내고 패키징을 시도하니 드디어 성공했다. 권한 관련 문제같긴 한데 왜 안됐던 건지 잘 모르겠다 😓 XCode는 참 요상하다.

## 참고
- [Operation not permitted](https://github.com/facebook/watchman/issues/977)
