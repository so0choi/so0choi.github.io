---
title: "[Node.js] Handlebar Missing helper 에러"
description: 'express에서 핸들바로 개발하는 중.. ’partial’ 기능을 사용하려는데 에러가 잡히지가 않았다. 스택오버플로우에서 알려준대로 해도 설정이 안먹히는 것 같았다. helper를 정의했는데도 에러가 뜨고 partial folder 경로를 정해줬는데도 자꾸 못 찾아왔다. 드디어 알아낸 문제의 원인은 과 이 두개의 vi…'
pubDate: 2021-12-10 14:49:28
tags:
  - Handlebars
  - Error
category: backend




---


express에서 핸들바로 개발하는 중.. 'partial' 기능을 사용하려는데 에러가 잡히지가 않았다. 스택오버플로우에서 알려준대로 해도 설정이 안먹히는 것 같았다.
helper를 정의했는데도 `Missing helper` 에러가 뜨고 partial folder 경로를 정해줬는데도 자꾸 못 찾아왔다. 드디어 알아낸 문제의 원인은 `hbs`과 `express-handlebars` 이 두개의 view engine 을 혼용하고 있어서.. 였다.
여러 코드 솔루션을 보다보니 저 두 개가 다른건줄 모르고 섞어서 쓰고있었다.
**.** 하나로 사용하는 엔진이 달라지다니.. 조심해야겠다.

## 원래 코드

```js
import express from "express";
import { create } from "express-handlebars";

const app = express();
const hbs = create({
  partialsDir: path.join(__dirname, "../views/partials"),
  helpers: {
    section: function (name: string, options: any): void {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
  },
});
this.app.engine("handlebars", hbs.engine);
this.app.set("view engine", "hbs");
```

이렇게 쓰면

```js
this.app.set("view engine", "hbs");
```

이 라인 때문에 위에 설정한 `express-handlebars`의 엔진을 쓰는게 아니라 `hbs` 라이브러리를 사용하게 된다. 그래서 위에 설정한 값이 아무것도 엔진에 들어가지 않게된다. 둘 중 한 개의 엔진만 사용하도록 수정하면 된다.

## 수정 후

나는 `hbs`를 사용하기로 하고 아래 코드로 수정했다.

```js
import express from "express";
// import {create} from 'express-handlebars'; <- 이 라인 삭제
import hbs from "hbs";
this.app.set("view engine", "hbs");
hbs.registerHelper("section", function (name, options) {
  if (!this._sections) this._sections = {};
  this._sections[name] = options.fn(this);
  return null;
});
hbs.registerPartials(__dirname + "/../views/partials");
```

이제 helper 뿐만 아니라 partials 폴더도 잘 인식한다.

### express-handlebars 사용하기

`express-handlebars`를 사용하려면 아래처럼 바꾸면 된다.

```js
import { create } from "express-handlebars";
const hbs = create({
  extname: ".hbs",
  // Specify helpers which are only registered on this instance.
  helpers: {
    if_equal: function (a, b, opts) {
      if (a == b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    },
  },
  // Specify partials directory
  partialsDir: path.join(__dirname, "../views/partials"),
});

//The following example sets up an Express app to use
//.hbs as the file extension for views:
app.engine(".hbs", hbs);
app.set("view engine", ".hbs"); //with dot!!!
```

마지막 라인에서 `.hbs`를 써주는게 중요하다. ⭐️

## 참고

[Stackoverflow - Error: Missing helper: "if_equal" handlebars](https://stackoverflow.com/questions/43978972/error-missing-helper-if-equal-handlebars)
