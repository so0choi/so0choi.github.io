---
title: Slack bot 만들기
description: 'Slack bot 만들기 슬랙 봇을 처음 만들어 보려고 했던 것은 몇개월 전의 일이다. BOJ 문제 풀이 슬랙 스터디 방을 만들었고, 매일 도장판 같은 이미지에 푼 문제들을 표시해서 스터디 방에 올려야 했다. 날짜가 바뀔 때 마다 누구 한 명이 새로운 날짜로 thread를 올리면 거기에 reply 하는 형식으로 도장판을…'
pubDate: 2020-09-22 21:32:53
tags:
  - Node.js
  - Slack bot
category: history





---



슬랙 봇을 처음 만들어 보려고 했던 것은 몇개월 전의 일이다. BOJ 문제 풀이 슬랙 스터디 방을 만들었고, 매일 도장판 같은 이미지에 푼 문제들을 표시해서 스터디 방에 올려야 했다.

날짜가 바뀔 때 마다 누구 한 명이 새로운 날짜로 thread를 올리면 거기에 reply 하는 형식으로 도장판을 올리곤했는데, 이런 '날짜 알림이' 역할을 해 줄 슬랙 봇을 만들어야 겠다는 생각이 들었다.

그 전부터 간단한 채팅이 가능한 봇을 만드는 사람들을 보면서 나도 만들어보고 싶었는데 그렇게 필요해진 순간이 와서 도전하게 되었다.

간단해 보였는데 생각만큼 잘 되지 않았다. Heroku 서버로 배포를 했는데 정해진 시간에 메세지가 오지 않았다..

> [이전에 만든 슬랙 봇](https://studyeong.blogspot.com/2020/05/nodejs-slack-bot.html)

글 마지막에 *내일 아침에 메세지가 온다면 성공*이라는 문구가 있는데 결국 메세지가 오지 않아서 실패했던 프로젝트가 되었다.

Node 공부를 하다보니 또 생각이 나서 다시 시도해봤다.
그런데 Slack에서 API나 Scope 설정 등 조금씩 바뀐 기능들이 있어서 최근에 작업을 진행한 블로그 글을 찾아 튜토리얼을 따라해봤다. 대충 틀을 잡은 후에는 [Slack API](https://api.slack.com/) 문서를 참고했다. 지난번과 달리 이번에는 `@slack/web-api` 를 사용했다.

[https://api.slack.com/web](https://api.slack.com/web)

## Slack bot app 생성

[api.slack.com/apps](https://api.slack.com/apps) 이곳에서 새로운 App을 만들어야 한다.

`Create New App` 을 눌러 새로운 app을 생성할 수 있다. bot의 이름과 사용될 Workspace를 지정하면 만들어진다.

`Basic Information` 탭에서 기본 설정을 할 수 있다. Slack 창에서 bot이 가지게 될 이름과 description, background를 설정할 수 있다.

`Add features and functionality`에서 `Bots`를 선택해주자.

`OAuth & Permissions` 탭에서 Token값을 얻을 수 있다. `xoxb`로 시작하는 토큰 값이 코드 작성에 사용된다.

## Heroku + Node.js

slack bot은 기본적으로 node.js를 지원한다. 서버는 Heroku를 사용할 것이기 때문에, [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs#prepare-the-app) 여기 나와있는 heroku가 제공하는 node.js starter pack을 클론했다.
이렇게 하면 `heroku`와 `express`가 설치된 프로젝트가 만들어진다.

## Slack bot 코드 작성

`index.js`에서 작업이 이루어진다. Heroku는 5000번 포트를 사용하기 때문에 아래와 같이 설정되어있는 것을 볼 수 있다.

```JS
const PORT = process.env.PORT || 5000;
```

Slack bot 을 만들기 위해서 `@slack/web-api` 모듈을 사용한다.
[Slack api-WebAPI](https://slack.dev/node-slack-sdk/web-api) 여길 참고하면 된다.

먼저 모듈을 설치한다.

```
$ npm install @slack/web-api
```

이제 Slack web api 모듈을 사용할 수 있는데, 클라이언트는 `WebClient`를 사용해 생성한다.

```js
const { WebClient } = require("@slack/web-api");

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// Initialize
const web = new WebClient(token);
```

Heroku에서 env 변수를 set 하기 위해서는 아래와 같이 커맨드에 입력하면 된다.

```
heroku config:set SLACK_TOKEN=아까 생성한 토큰 값
```

Slack에서 서버로의 요청을 `POST` 방식이다. 따라서 express 앱에 `POST` 라우터를 작성하면 되겠다. 적당한 `url`을 지정한다.

```js
express()
  .use(express.json())
  .post("/slack/events", (req, res) => {
    let body = req.body;
    let event = body.event;
    if (body.type === "event_callback") {
      console.log(event);
      if (event.type === "message") {
        if (event.text === "안녕") {
          console.log(
            `메시지 수신 channel:${event.channel}, user:${event.user}`
          );
          web.chat
            .postMessage({ channel: event.channel, text: "안녕하세요 :wink:" })
            .then((result) => {
              console.log("Message sent: " + result.ts);
            });
          res.sendStatus(200);
        }
      }
    } else if (body.type === "url_verification") {
      // URL 검증을 위한 처리
      console.log("url verification");
      res.send(body.challenge);
    } else {
      res.sendStatus(200);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
```

테스트를 위해 ['Node.js로 슬랙 API 연동'](https://nnoco.tistory.com/299) 블로그의 소스코드를 사용했다. Slack Web API 사용 과정을 이해하기 좋은 간단한 코드였다.

그리고 Heroku 앱을 생성해준다.

```
heroku create
git add .
git commit -m "create slack bot"
git push heroku master
```

이렇게 하면 heroku 서버가 `heroku`라는 이름으로 git remote에 추가된다. 현재 브랜치를 `heroku` 리모트 서버에 `push`하면 heroku 앱은 자동으로 빌드를 시작하고 앱이 디플로이 된다.

빌드 처리 중에 url이 하나 생성될 텐데, 그 주소가 heroku app의 주소이다. 복사해 두자.
Slack이 내가 생성한 heroku app에 이벤트를 `POST`할 수 있도록 'Event Subscriptions' 설정을 해야한다.
Slack App에 아까 생성한 bot의 설정 페이지에서 'Event Subscriptions' 탭으로 들어간다.

## Reference

[Node.js로 슬랙 API 연동](https://nnoco.tistory.com/299)
