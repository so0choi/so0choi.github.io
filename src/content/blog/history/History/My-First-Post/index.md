---
title: Github 블로그 Hexo로 만들기
description: 'Git Page로 블로그를 만들었다 이미 써오던 블로그에 글이 점점 많아져서 더욱더 열심히 쓰고 있었는데 아무리 봐도 <strong github.io</strong 도메인은 너무 멋이난다.. 결국 큰 결심을하고 프레임워크를 이용해 새로 만들기로 결정. 이참에 마크다운 문법이나 제대로 익혀놓으면 좋겠다는 생각도 했다. J…'
pubDate: 2020-08-14 17:26:46
tags:
  - Hexo
category: history





---


## Git Page로 블로그를 만들었다

이미 써오던 [블로그](https://studyeong.blogspot.com)에 글이 점점 많아져서 더욱더 열심히 쓰고 있었는데 아무리 봐도 <strong>github.io</strong> 도메인은 너무 멋이난다.. 결국 큰 결심을하고 프레임워크를 이용해 새로 만들기로 결정. 이참에 마크다운 문법이나 제대로 익혀놓으면 좋겠다는 생각도 했다.
Jekyll과 Hexo 중 고민하다가 Hexo를 사용하기로 한 이유는 Jekyll은 Ruby, Hexo는 Node.js를 사용하기 때문이다.
Ruby는 사용해 본 적이 없기때문에 익숙하고 이미 설치가 되어있는 Node.js 서버를 사용하는 Hexo를 사용하기로 결정!

_Node.js가 이미 설치되어 있다는 가정 하에 시작한다_

## Git Page + Hexo 사용법

### Github에서 Repository 만들기

`'github 유저네임'.github.io` 를 블로그 url로 사용하고 싶다면 레파지토리 이름을 저렇게 지정하면 된다.하지만 이미 해당 레파지 이름을 사용하고 있다면 다른 프로젝트를 하나 만들고 Git page사용을 활성화 시켜주면 된다.
(이 경우 url은 `'유저네임'.github.io/'프로젝트 이름'`) 그리고 로컬 저장소에 clone 시켜둔다.

### hexo 설치하기

```bash
npm install hexo-cli -g
hexo init <folder>
cd <folder>
npm install
```

이렇게만 하면 블로그 생성은 끝이다! 정말 간단하다.

생성된 hexo 프로젝트 폴더 내부로 들어가면 `_config.yml`파일이 생성되어있을 것이다.
설정 파일이다. 내부에서 블로그 기본 설정들을 할 수 있다.

### Theme 설정하기

Hexo는 Jekyll 다음으로 사용자가 많은 프레임웍이라 테마도 아주 많다.
[여기](https://hexo.io/themes/) 서 굉장히 많은 테마를 찾을 수 있다. 마음에 드는 것으로 고르면 제작자의 Github 페이지가 나올 것이다.

대부분의 제작자가 `README.md` 파일에서 테마 설정법을 자세히 알려줄 것이다.

## 커스터마이징

이제 블로그의 틀은 모두 잡혔을 것이다. 여기서 자신의 테마에 더 입힐 수 있는 내장된 스타일을 적용하거나 폰트를 다운받아 입히거나 다양하게 블로그를 꾸밀 수 있다. 나는 깃허브 Distribution Calendar를 profile 페이지에 추가하고 한글로 쓰여질 블로그를 위해 '나눔스퀘어라운드' 폰트를 적용시켰다.

## 글 쓰기

Hexo에서 글을 생성하면 `yyyy/mm/dd/글제목` 형식으로 만들어진다.

```
hexo new post "post title"
```

명령어로 글을 생성하면 `source/_posts` 폴더에 markdown 파일이 지정한 title로 생성된다. `_posts` 폴더 하부에 subfolder 들을 생성해 카테고리 별로 글을 저장해도 hexo가 글들을 인식하는데 문제가 생기지 않기 때문에 사용자가 편의에 따라 폴더를 나누어 글들을 관리해도 좋다.

## 마치며

글을 쓸 때마다 ide로 써야 한다는게 아직도 적응이 잘 안된다. 적응 되는 그 날까지 화이팅..~
