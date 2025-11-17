---
title: "Node.js 설치 GLIBC_x 에러"
description: 'node 설치 후 아래와 같은 에러가 발생할 때가 있다. 에러의 발생 원인은 Node.js를 설치한 서버의 Operating System이 설치한 Node.js가 지원하는 것보다 낮은 버전의 GLIBC를 가지고있기 때문이다. 예를 들어 Node v18.x는 GLIBC v2.7 이상을 지원하기 때문에 GLIBC v2.6을…'
pubDate: 2024-01-10 13:41:49
category: Error

---


node 설치 후 아래와 같은 에러가 발생할 때가 있다.

```
node: /lib/x86_64-linux-gnu/libm.so.6: version `GLIBC_2.27' not found (required by node)
node: /usr/lib/x86_64-linux-gnu/libstdc++.so.6: version `GLIBCXX_3.4.20' not found (required by node)
node: /usr/lib/x86_64-linux-gnu/libstdc++.so.6: version `CXXABI_1.3.9' not found (required by node)
node: /usr/lib/x86_64-linux-gnu/libstdc++.so.6: version `GLIBCXX_3.4.21' not found (required by node)
node: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.28' not found (required by node)
node: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.25' not found (required by node)
```

에러의 발생 원인은 Node.js를 설치한 서버의 Operating System이 설치한 Node.js가 지원하는 것보다 낮은 버전의 GLIBC를 가지고있기 때문이다.
예를 들어 Node v18.x는 GLIBC v2.7 이상을 지원하기 때문에 GLIBC v2.6을 가진 Linux OS 서버에 Node v18.x를 설치하려고하면 위의 오류가 발생하는 것이다.

## 해결 방법

해결 방법은 두 가지가 있다.

1. 서버의 사양을 높인다.
2. GLIBC 버전에 맞는 Node 버전을 사용한다.

서버 사양을 높일 순 없어서 Node 버전을 낮추기로 했다.
상황에 맞게 서버와 노드의 버전을 맞춰 사용하면 오류를 해결할 수 있다.

## 참고
- [Stackoverflow](https://stackoverflow.com/questions/74698021/installing-node-lib64-libm-so-6-version-glibc-2-27-not-found-required-by-n)
