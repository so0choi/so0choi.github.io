---
title: pm2 permission denied 에러
description: 'pm2로 프로세스를 시작하려고 했는데 에러가 발생했다. 를 사용해 root 사용자로 사용하고 있었다. 권한 문제인 것 같아 root가 아닌 다른 사용자로 프로세스를 시작하려고 했는데 아래와 같은 에러가 나타났다. 서치해보니 root 사용자가 아닌 사용자는 1024 이하 포트를 열 수 없다고 한다. (참고) 프로세스는 r…'
pubDate: 2022-11-17 15:26:48
category: troubleshooting
tags:
  - pm2
  - nvm
  - node




---


pm2로 프로세스를 시작하려고 했는데 `permission denied` 에러가 발생했다.

```shell
$ npm start development

> mbus-api-play@1.0.1 start
> pm2 start ./ecosystem.config.js --env development

Error: EACCES: permission denied, mkdir '/root/.pm2/logs'
    at Object.mkdirSync (node:fs:1382:3)
    at mkdirpNativeSync (/usr/local/lib/node_modules/pm2/node_modules/mkdirp/lib/mkdirp-native.js:29:10)
    at Function.mkdirpSync [as sync] (/usr/local/lib/node_modules/pm2/node_modules/mkdirp/index.js:21:7)
    at module.exports.Client.initFileStructure (/usr/local/lib/node_modules/pm2/lib/Client.js:133:25)
    at new module.exports (/usr/local/lib/node_modules/pm2/lib/Client.js:38:8)
    at new API (/usr/local/lib/node_modules/pm2/lib/API.js:107:19)
    at Object.<anonymous> (/usr/local/lib/node_modules/pm2/lib/binaries/CLI.js:22:11)
    at Module._compile (node:internal/modules/cjs/loader:1155:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1209:10)
    at Module.load (node:internal/modules/cjs/loader:1033:32)
Error: EACCES: permission denied, mkdir '/root/.pm2/pids'
    at Object.mkdirSync (node:fs:1382:3)
    at mkdirpNativeSync (/usr/local/lib/node_modules/pm2/node_modules/mkdirp/lib/mkdirp-native.js:29:10)
    at Function.mkdirpSync [as sync] (/usr/local/lib/node_modules/pm2/node_modules/mkdirp/index.js:21:7)
    .....
```

`sudo -i` 를 사용해 root 사용자로 사용하고 있었다. 권한 문제인 것 같아 root가 아닌 다른 사용자로 프로세스를 시작하려고 했는데 아래와 같은 에러가 나타났다.

```shell
Error: listen EACCES: permission denied 0.0.0.0:80
```

서치해보니 root 사용자가 아닌 사용자는 1024 이하 포트를 열 수 없다고 한다. ([참고](https://stackoverflow.com/questions/60372618/nodejs-listen-eacces-permission-denied-0-0-0-080))

프로세스는 root 사용자로 시작해야되는 게 맞나보다.. 
그리고 기록해두지 못했는데 이것저것 해보다가 pm2가 node 버전이 낮다는 에러도 보여줬다. 확인해보니 sudo 일 때와 sudo를 사용하지 않을 때 사용하는 node가 달랐다.

```shell
$ node -v
v16.18.0
$ which node
/root/.nvm/versions/node/v16.18.1/bin/node
$ sudo node -v
v8.x
$ sudo which node
/usr/loca/bin/pm2
```

에러를 찾아보니 [이 글](https://stackoverflow.com/questions/21215059/cant-use-nvm-from-root-or-sudo)을 찾았다. (can't use nvm from root or sudo) 제일 상단의 답변에 있는 커맨드를 실행하니 해결이 되었다.

```shell
n=$(which node); \
n=${n%/bin/node}; \
chmod -R 755 $n/bin/*; \
sudo cp -r $n/{bin,lib,share} /usr/local
```
잘못하면 시스템을 망가뜨릴 수도 있다고 조심해서 사용하라고 한다.

이제 sudo나 root에서도 nvm이 설치한 노드를 사용하는데 여전히 pm2 권한 문제가 해결되지 않았다...
권한 에러가 난 파일들을 `chmod` 하는건 의미가 없는 것 같았고 🥲.. 다른 글을 보니 pm2를 재설치 해보라고 한다.

```shell
$ sudo npm install pm2 -g
```

이렇게 했는데도 안되면 node를 재설치 하라고 한다! nvm도 재설치 했다.
하지만 아무리해도 같은 에러가 발생했다. 일단 실행시킬 수 있는 방법은 `npm start`가 아니라 sudo를 붙여서 직접 pm2를 실행시키는 것이다. ..

```shell
sudo pm2 start ./ecosystem.config.js --env development
```

왜 안되는 걸까 ? ㅎㅎ 나중에 다시 해봐야지..