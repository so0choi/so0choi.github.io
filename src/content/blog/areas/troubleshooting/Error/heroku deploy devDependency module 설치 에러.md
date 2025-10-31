---
title: Heroku deploy error - devDependency module 설치 이상
description: 'Heroku devDependency Module ’not found’ Error Problem GraphQL yoga로 만든 간단한 api 서버를 heroku에 deploy하려는데 계속 오류가 발생했다. 에러 메세지는 아래와 같다. 파일에서 모듈은 devDependency에 들어가있었다. ’package.json’ 다…'
pubDate: 2021-03-27 19:42:32
tags: heroku
category: Error

---


# Heroku devDependency Module 'not found' Error

## Problem

GraphQL-yoga로 만든 간단한 api 서버를 heroku에 deploy하려는데 계속 오류가 발생했다. 에러 메세지는 아래와 같다.

```
...
2021-03-27T10:35:52.906327+00:00 app[web.1]: [nodemon] starting `babel-node index.js`
2021-03-27T10:35:52.939566+00:00 app[web.1]: sh: 1: babel-node: not found
2021-03-27T10:35:52.976590+00:00 app[web.1]: [nodemon] failed to start process, "babel-node" exec not found
2021-03-27T10:35:52.978952+00:00 app[web.1]: [nodemon] Error
...
```

`package.json` 파일에서 `babel-node`모듈은 devDependency에 들어가있었다.

'package.json'

```
"dependencies": {
    "axios": "^0.21.1",
    "graphql-yoga": "^1.18.3",
    "node-fetch": "^2.6.1",
    "nodemon": "^2.0.7"
  },
  "scripts": {
    "start": "nodemon --exec babel-node index.js"
  },
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-node": "^0.0.1-security",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-3": "^6.24.1"
  }
```

다른 모듈들은 제대로 설치되어 동작하지만 devDependencies의 모듈을 설치하지 않는 것 같았다.

## Solution

["babel: not found" while deploying to heroku #36](https://github.com/developit/express-es6-rest-api/issues/36)

여기서 해결법을 찾을 수 있었는데, 간단히 Heroku config variable `NPM_CONFIG_PRODUCTION`을 `false`로 수정하면 된다.

```
$ heroku config:set NPM_CONFIG_PRODUCTION=false
Adding config vars and restarting myapp... done, v12
```

Heroku가 자동으로 devDependencies를 설치하지 않기 떄문에 발생하는 오류였다.
