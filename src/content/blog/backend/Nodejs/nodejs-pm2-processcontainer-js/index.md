---
title: NodeJS pm2 ProcessContainer.js 오류
description: 'NodeJS pm2 ProcessContainer.js 오류 Node 앱을 따로 시작하는 것은 문제가 없는데 PM2로 실행하는데서 자꾸 문제가 발생했다. 문제 및 에러로그 요런 오류가 뜨면서 실행이 되지않았다. pm2 env가 변경되어 발생하는 에러라고 한다. 해결 pm2 env 디렉토리를 삭제하고 pm2를 다시 설정하…'
pubDate: 2022-01-17 14:30:18
tags:
  - Node.js
  - pm2
category: backend





---



Node 앱을 따로 시작하는 것은 문제가 없는데 PM2로 실행하는데서 자꾸 문제가 발생했다.

## 문제 및 에러로그

```
PM2        | 2022-01-17T14:04:33: PM2 log: App [NETWORKCHECK-AND-PLAYERDEMO:0] online
PM2        | node:internal/modules/cjs/loader:936
PM2        |   throw err;
PM2        |   ^
PM2        |
PM2        | Error: Cannot find module '/usr/local/temp/APP_NAME/node_modules/pm2/lib/ProcessContainer.js'
PM2        |     at Function.Module._resolveFilename (node:internal/modules/cjs/loader:933:15)
PM2        |     at Function.Module._load (node:internal/modules/cjs/loader:778:27)
PM2        |     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
PM2        |     at node:internal/main/run_main_module:17:47 {
PM2        |   code: 'MODULE_NOT_FOUND',
PM2        |   requireStack: []
PM2        | }
PM2        | 2022-01-17T14:04:33: PM2 log: App name:APP_NAME id:0 disconnected
PM2        | 2022-01-17T14:04:33: PM2 log: App [APP_NAME:0] exited with code [1] via signal [SIGINT]

PM2      | App [APP_NAME:0] starting in -cluster mode-
PM2      | App [APP_NAME:0] online
PM2      | App name:APP_NAME id:0 disconnected
PM2      | App [APP_NAME:0] exited with code [1] via signal [SIGINT]
PM2      | App [APP_NAME:0] starting in -cluster mode-
PM2      | App [APP_NAME:0] online
PM2      | App name:APP_NAME id:0 disconnected
PM2      | App [APP_NAME:0] exited with code [1] via signal [SIGINT]
PM2      | App [APP_NAME:0] starting in -cluster mode-
PM2      | App [APP_NAME:0] online
PM2      | App name:APP_NAME id:0 disconnected
PM2      | App [APP_NAME:0] exited with code [1] via signal [SIGINT]
PM2      | App [APP_NAME:0] starting in -cluster mode-
PM2      | App [APP_NAME:0] online
PM2      | App name:APP_NAME id:0 disconnected
PM2      | App [APP_NAME:0] exited with code [1] via signal [SIGINT]
PM2      | Script /usr/local/midibus/mbus_demo_and_network/dist/main.js had too many unstable restarts (16). Stopped. "errored"

```

요런 오류가 뜨면서 실행이 되지않았다.
pm2 env가 변경되어 발생하는 에러라고 한다.

## 해결

pm2 env 디렉토리를 삭제하고 pm2를 다시 설정하면 된다.

```
rm -rf ~/.pm2
```

정상 구동되는 것을 확인했다.
