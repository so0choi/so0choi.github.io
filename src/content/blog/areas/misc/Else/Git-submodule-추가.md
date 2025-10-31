---
title: Git submodule 추가
description: 'hexo로 블로그를 생성해 테마를 설치해서 사용하면 다른 로컬 환경에서 블로그 프로젝트를 clone 했을 때 디렉토리 내부의 테마 디렉토리들이 비어있는 상태로 받아지는 것을 볼 수 있다. 내부에 git 레파지토리가 따로 구성되어있기 때문인데 다른 컴퓨터에서도 원활하게 사용할 수 있도록 submodule을 설정해줬다. s…'
pubDate: 2021-12-06 16:25:02
category: Else
tags:
  - hexo
  - git submodule

---


hexo로 블로그를 생성해 테마를 설치해서 사용하면 다른 로컬 환경에서 블로그 프로젝트를 clone 했을 때 `themes` 디렉토리 내부의 테마 디렉토리들이 비어있는 상태로 받아지는 것을 볼 수 있다. 내부에 git 레파지토리가 따로 구성되어있기 때문인데 다른 컴퓨터에서도 원활하게 사용할 수 있도록 submodule을 설정해줬다.

## submodule

submodule이란 Git 저장소 안에 다른 Git 저장소를 디렉토리로 분리해 넣는 것이다. 다른 독립된 Git 저장소를 Clone 해서 내 Git 저장소 안에 포함할 수 있으며 각 저장소의 커밋은 독립적으로 관리한다.

자세한 내용은 [7.11 Git 도구 - 서브모듈](https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-%EC%84%9C%EB%B8%8C%EB%AA%A8%EB%93%88) 여기서 볼 수 있다. 나는 블로그 운용만 쉽게 할 수 있게 간단히 훑어보고 필요한 작업만 해놓았다. 잘 알아두면 나중에 실무에서도 유용하게 쓸 수 있을 것 같다.

## hexo theme submodule 적용

가장 깔끔한 방법은 테마를 처음 설치할 때 부터 submodule로 추가시키는 것이다.

### submodule 추가

```
git submodule add [테마 git repository url] theme/[theme 이름]
```

이미 테마를 설치해서 사용하던 경우엔 어떻게 할까?
[How to make an existing directory within a git repository a git submodule](https://newbedev.com/how-to-make-an-existing-directory-within-a-git-repository-a-git-submodule)
이 글을 참고해서 하면 될 것 같다.. 하지만 난 그냥 테마 레파지토리를 생성해서 git에 올려놓고 디렉토리와 관련된 git cache를 삭제하고 submodule로 새로 add 시키는 예전 방식을 따랐다. 파일을 삭제하는 위험한 작업이라서 `absorbgitdirs`를 쓰는게 더 바람직해보인다.

### submodule 커밋

테마를 submodule로 추가한 뒤에는 테마 설정 파일에 변화가 있는 경우 theme/[테마 이름] 경로에서 commit을 해주고 다시 root 경로에서 commit 후에 push 하면 된다.

```
cd theme/Chic
git add .
git commit -m "Edit theme config"
cd ../../
git add .
git commit -m "Edit theme config"
git push origin master
```

### submodule 클론

이렇게 추가된 submodule까지 clone 해오려면 추가 옵션을 붙여줘야 한다.

#### 한 번에 가져오는 방법

```
git clone [repository url] --recurse-submodules
```

#### 나눠서 가져오는 방법

```
git clone [repository url]
git submodule init
git submodule update
```

### 그 외 명령어

- submodule 리스팅

```
git submodule status
git submodule status --recursive
```

- submodule 삭제

1. `.gitmodules` 파일을 열어 관련 서브모듈 내용 삭제
2. `.git/config` 파일을 열어 관련 서브모듈 내용 삭제
3. `git rm --cached <서브모듈폴더>`
4. commit

## 참고

[Git submodule 간단 사용법 1](https://velog.io/@honux/Git-submodule-%EA%B0%84%EB%8B%A8-%EC%82%AC%EC%9A%A9%EB%B2%95-1)
