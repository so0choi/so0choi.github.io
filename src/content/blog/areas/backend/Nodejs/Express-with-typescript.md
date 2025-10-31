---
title: Express.js Typescript 보일러플레이트 만들기 (for WEB)
description: 'Express는 Nest와 달리 정해진 구조가 없기때문에 구글링을 해도 개발자에 따라 코드 작성 방식이 크게 차이가난다. Nest로 프로젝트를 구성하면 알아서 구조가 잡히고 여러 면에서 편리하지만, 현재 맡은 프로젝트에서는 API 개발도 아니고 간단한 페이지만 만들면 되는데 Nest를 쓰기에 필요이상으로 프로젝트 크기가…'
pubDate: 2021-12-13 10:52:39
tags:
  - Express.js
category: Node.js

---


Express는 Nest와 달리 정해진 구조가 없기때문에 구글링을 해도 개발자에 따라 코드 작성 방식이 크게 차이가난다. Nest로 프로젝트를 구성하면 알아서 구조가 잡히고 여러 면에서 편리하지만, 현재 맡은 프로젝트에서는 API 개발도 아니고 간단한 페이지만 만들면 되는데 Nest를 쓰기에 필요이상으로 프로젝트 크기가 커지는 것 같아서 Expres를 사용하기로 했다. 앞으로도 경우에 따라 쓸 일이 생길 것 같아 여러 예시를 보고 내 취향에 맞게 템플릿을 만들어 놓기로 했다.
참고로 Express로 구조가 잘 만들어진 보일러 플레이트는 [여기](https://github.com/w3tecch/express-typescript-boilerplate)서 볼 수 있다. W3tech에서 만든 **express-typescript-boilerplate**이다. GraphQ, Docker, Jest, TypeORM, class-validator... 등 다양한 기능이 이미 들어가있다. 나는 정말 가벼운 템플릿이 필요해서 새로 만들어 놓기로 결정했다.

## 참고

- [타입스크립트로 Express 시작하기](https://kimyang-sun.tistory.com/entry/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A1%9C-Express-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-Nodejs-Express-TypeScript)
