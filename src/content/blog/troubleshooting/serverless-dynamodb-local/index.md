---
title: "[Error] Serverless DynamoDB local 설치 이슈"
description: '테스트를 위해 local DynamoDB를 serverless에 설치하려는데 에러가 발생했다. 설치 명령어를 입력하면 아래 에러가 발생하며 설치가 실행되지 않았다. 검색해보니 이미 많은 사람들이 겪고있는 문제였다. (Error getting DynamoDb local latest tar.gz location undefi…'
pubDate: 2023-05-15 10:17:23
tags:
  - serverless
  - DynamoDB
category: Error

---


테스트를 위해 local DynamoDB를 serverless에 설치하려는데 에러가 발생했다.

```
sls dynamodb install
```

설치 명령어를 입력하면 아래 에러가 발생하며 설치가 실행되지 않았다.

> Error: Error getting DynamoDb local latest tar.gz location undefined: 403

검색해보니 이미 많은 사람들이 겪고있는 문제였다. ([Error getting DynamoDb local latest tar.gz location undefined: 403](https://github.com/99x/serverless-dynamodb-local/issues/294))

공식 해결법은 아직 없는 것 같고 라이브러리 코드를 조금 수정해서 해결할 수 있었다.

## 해결법

`node_modules/dynamodb-localhost/dynamodb/config.json` 파일을 열어 `download_url`을 `https://s3.us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz`로 수정한다.

```json
{
  "setup": {
    "download_url": "https://s3.us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz",
    "install_path": "bin",
    "jar": "DynamoDBLocal.jar"
  },
  "start": {
    "port": 8000
  }
}
```

위와 같은 모양이 될 것이다.

그리고 `node_modules/dynamodb-localhost/dynamodb/isntaller.js` 파일에서 `http`를 `https`로 바꾸면 된다.

```js
// ...
var tar = require("tar"),
    zlib = require("zlib"),
    path = require("path"),
    https = require("https")
// ...
https
    .get(downloadUrl, function(response) {
        var len = parseInt(response.headers["content-length"], 10),
// ......
```

파일 수정 후 `sls dynamodb install` 명령어를 다시 실행하니 정상적으로 설치 되었다.
