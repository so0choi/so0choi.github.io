---
title: Blogger 에서 Hexo로 전환하기
description: 'Blogger에 남겨둔 많은 포스트들을 어떻게 할까 생각했는데 아무래도 앞으로는 계속 Hexo에서 포스팅을 하게 될 것 같아 포스트를 이동시켜야 되겠다는 생각을 했다. Migration 플러그인이 있지 않을까 싶어서 찾아봤는데 역시 있었다! hexo 공식 Migration plugins 하지만 여기 Blogger는 없었…'
pubDate: 2020-08-23 17:55:35
tags:
  - Blogger
  - Hexo
category: history




---


Blogger에 남겨둔 많은 포스트들을 어떻게 할까 생각했는데 아무래도 앞으로는 계속 Hexo에서 포스팅을 하게 될 것 같아 포스트를 이동시켜야 되겠다는 생각을 했다. Migration 플러그인이 있지 않을까 싶어서 찾아봤는데 역시 있었다!
[hexo 공식 Migration plugins](https://hexo.io/docs/migration.html) 하지만 여기 Blogger는 없었다.

그 밖에 처음 찾았던 플러그인은 [Blogger to Hexo](https://github.com/hr6r/hexo-migrator-blogger) 로 블로거만을 위한 플러그인이었는데 설치하면서 자꾸 에러를 만나고 설치에 실패했다.. Issues 를 보면 node 버젼이 업데이트 되면서 뭔가 에러가 나는데 수정이 안되는것 같았다.

이번엔 rss를 사용하는 플러그인을 찾았다. [링크](https://github.com/hexojs/hexo-migrator-rss) 다른 사용자의 [블로그](http://jr0cket.co.uk/2014/04/migrating-articles-to-hexo-from-bloggercom.html) 에서 찾은 방법인데 설치는 제대로 되었다.

나도 글쓴분 처럼 import 용 새로운 hexo blog를 만들어서 테스트 해봤다.

```
npm install hexo-migrator-rss --save
hexo init hext-blogger-import
hexo migrate <src> [--option]
```

와우! 최근 25개의 글을 받아오는 것을 확인했다. 하지만 많은 어려움을 발견했다. Blogger에서 코드 블럭을 ColorScript를 사용해 작성해 인덴트와 줄바꿈이 엉망으로 불어와졌고, 백준이나 타 사이트에서 그대로 붙여넣기 한 글들이 엉망진창으로 불러와졌다.

## 결론

그냥 하나씩 시간날때마다 수작업으로 옮기기로 했다. 타 블로그 프레임워크들은 플러그인이 잘 구성되어있는것 같은데 블로그스팟은 사용자가 적어서 그런걸까 .. :sweat:
