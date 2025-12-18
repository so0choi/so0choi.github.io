---
title: "[Node.js] EventLoop"
description: 'Node.js 동작 방식 Node.js를 창시한 라이언 달이 노드를 만든 이유로 꼽은 것은, 기존에 많이 사용되고 있는 WAS라고 불리는 Apache, Tomcat 같은 서버들은 오래걸리는 blocking 작업에서 원활한 사용에 문제가 생겨 동시성 프로그래밍을 위해 Node.js를 만들었다고 한다. Node를 사용하는…'
heroImage: './2020-09-15-15-59-51.png'
pubDate: 2020-09-15 14:41:47
tags:
  - Node.js
category: backend






---



# Node.js 동작 방식

Node.js를 창시한 라이언 달이 노드를 만든 이유로 꼽은 것은, 기존에 많이 사용되고 있는 WAS라고 불리는 Apache, Tomcat 같은 서버들은 오래걸리는 blocking 작업에서 원활한 사용에 문제가 생겨 동시성 프로그래밍을 위해 Node.js를 만들었다고 한다.

Node를 사용하는 이유 중 가장 큰 특징을 뽑아보면,

1. 처리 속도가 빠르다.
2. 모든 동작이 비동기 기반이다.
3. Event driven 이다.

이렇게 두가지가 있다.
처리 속도가 빠른 이유는 Node의 동작 방식에서 찾아볼 수 있다.

Node.js 는`Event Loop` 중심으로 동작한다. 구글에서 여러 구조 사진을 볼 수 있지만 대부분의 사진이 틀린 정보라고 한다.

![](./2020-09-15-15-59-51.png)

이런 구조가 굉장히 보편적이었는데, 이 구조는 라이언 달 관점에서는 꽤 오해를 낳는 구조라고 한다. 구조가 완전히 틀린 것은 아니지만 핵심 철학을 흐리게 만들기 쉬운 그림이다.
그림을 보면, 막히는 작업은 스레드풀로 보내 데이터베이스나 파일 시스템을 처리하는 것으로 보이는데, Node.js의 철학은 **애초에 블로킹 작업을 만들지 마라**, **OS의 비동기 I/O를 그대로 사용하라**는 것이다. EventLoop는 I/O 상태를 감지하고 콜백을 실행하는 역할을 할 뿐이다. 스레드풀은 비동기가 불가능한 일부 작업을 어쩔 수 없이 우회 처리하는 곳이 되어야 한다. Node.js의 기본 동작 및 이벤트루프에 대한 정보를 찾을 때 나오는 그림이 저런 모양이라면 마치 스레드풀이 Node.js의 핵심 구성 요소처럼 보이게 만들어 철학이 왜곡될 수 있다.

또한 모든 외부 리소스 접근이 스레드풀을 거치는 것도 아니다. 정확히는 

```
JS
 ↓
libuv
 ↓
OS (epoll / kqueue / IOCP)
 ↓
callback 큐
```

이 순서로 처리되는 경우가 더 많다.


![](./2020-09-15-16-03-13.png)

이 구조가 더 Node.js 개발자가 밝힌 내용과 부합한 내용이라고 한다. 사진 중앙에 libuv와 비동기 작업이 크게 위치하고 있으며 OS 영역으로 나뉜 부분에 스레드와 파일 시스템이 위치하는 것을 보면 Node.js가 직접 스레드를 동작시키는 것이 아닌 OS의 비동기 매커니즘을 그대로 따르는 개념을 알 수 있다. 

그럼에도 불구하고 이 그림에도 문제점이 있다면 Blocking operation을 스레드풀로 보내는 것 처럼 보이는데 이는 Node.js에서 blocking operation이 불가능한 것 처럼 보이게 한다. 정확히는 '비동기화가 불가능한 작업을 어쩔 수 없이 스레드풀에 위임'하는 것이 맞는 표현이다.

## Event Loop

메인 스레드 겸 싱글 스레드로서 비즈니스 로직을 수행한다. 모든 작업이 이벤트 루프를 중심으로 일어나기 때문에 이벤트 루프가 멈추면 아무 작업도 수행하지 못한다.

싱글스레드 방식을 사용함에도 여러가지 작업을 동시에 처리할 수 있는 이유가 이벤트 루프에있다.

[Help, I’m stuck in an event-loop.](https://vimeo.com/96425312)

이 영상은 전에도 한 번 본 적이 있었는데, 공부를 조금 더 하고 지금 다시보니 얼마나 잘 설명하고 있는 영상인지 확실히 알게되었다.

프로그램이 수행해야 할 작업들은 순서대로 stack에 쌓이게된다.
그리고 이때 다른 서버에 접속해 데이터를 fetch 하거나 하는 오래 걸리는 작업들을 `blocking`된다고 한다.
이벤트 루프는 그런 오래 걸리는 작업들을 워커에 할당한다. 그리고 스택에서 해당 작업을 내리고 다음 작업을 계속해서 진행한다.

다른 연산 결과가 필요하지 않고 병렬적으로 실행될 수 있는 작업들은 `non-blocking` 이라고 한다. 이 때문에 자바스크립트의 동작 속도가 빠를 수 있는 것이다.

오래걸리는 blocking 작업이 끝나게 되면 그 결과는 event queue에 들어온다. Evnet loop는 RR 방식으로 각 큐를 돌면서 작업들을 처리하는데 이 때 stack이 비어있어야 Event queue의 작업들을 stack에 올릴 수 있다.

### Event driven

자바스크립트는 이벤트 기반의 동작을 한다.
이벤트 기반의 반대는 일반적인 `스레드 풀` 기반의 동작이라고 할 수 있는데, 이 구조에서는 사용자의 I/O 요청에서 오래 걸리는 작업이 있을 경우 한 가지 작업이 끝날 때까지 (즉 동기적으로) 대기하며 이것이 완료되면 다음 작업이 순차적으로 진행되는 방식이다.

반면 이벤트 기반의 동작 방식이란, 순차적인 이벤트 진행이 아닌 사용자가 이벤트를 실행시켰을 때 이에 대한 callback을 호출하는 방식으로 비동기적으로 동작하는 방식이다.
이것은 자바스크립트가 원래 나온것이 웹에서 사용되기 위함이었기 때문이다.

[loupe](http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D)
자바스크립트 동작 과정을 눈으로 볼 수 있는 사이트이다. 위 동영상 강연자분이 실제로 사용했던 사이트라고 한다.

## 후기

사실 더 깊이 들어가면 더욱 복잡한 구조가 존재한다. 내가 제대로 이해한 것인지 아직 감이 오지 않는다. 작성한 내용에도 잘못된 정보가 있을지도 모른다. 언젠가 꼭 완벽하게 이해할 수 있었으면 좋겠다. 😅

## Reference

[Node.js 이벤트루프 제대로 이해하기](https://tk-one.github.io/2019/02/07/nodejs-event-loop/)

[nodejs의 내부 동작 원리 (libuv, 이벤트루프, 워커쓰레드, 비동기)](https://sjh836.tistory.com/149)

[TOAST Meetup - 자바스크립트와 이벤트 루프](https://meetup.toast.com/posts/89)
