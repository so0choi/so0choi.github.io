---
title: "Git 브랜치 합치기 전략들"
description: "rebase, merge, squash를 알아보자"
pubDate: 2026-02-23 15:14:27
category: misc

---

# Git 브랜치 합치기 전략들

## merge

merge는 두 개 이상의 개발 히스토리를 하나로 합치는 명령이다. 타 브랜치의 변경 내용을 히스토리와 함께 현재 브랜치로 합치는 명령어이다. `git pull`을 실행했을 때도 `git merge`가 실행된다.

```shell
          A---B---C feature
         /
    D---E---F---G master
```

브랜치 상태가 위와 같고 현재 브랜치가 master일 때, `git merge feature`를 실행하면 feature 브랜치에서 만들어진 수정 내용들이 히스토리와 함께 master 브랜치에 합쳐져 새로운 커밋을 생성한다. 

```shell
          A---B---C feature
         /         \
    D---E---F---G---H master
```

merge를 진행하는 도중 양쪽 브랜치에서 같은 파일에 변경사항을 만들면 충돌이 발생하고 merge 작업이 중단된다. 

### 사용 방법

```shell
git merge [merge target branch]
```

## rebase

커밋들을 다른 베이스로 위치 재조정 하는 커맨드이다. 타 브랜치로 이식한다고 생각하면 된다. 

```shell
         A---B---C feature
         /
    D---E---F---G master
```

마스터 브랜치에서 분기해 나온 feature를 개발 후 이를 최신 master 브랜치로 위치시키고 싶을 때 rebase를 사용한다. feature 브랜치로 이동해 `git rebase master` 쓰면 아래와 같이 base 위치가 바뀐다.

```shell
                  A'--B'--C' feature
                 /
    D---E---F---G master
```

충돌이 발생하면 작업이 중단된다. rebase가 실행된 커밋은 커밋 해시 값이 바뀌게 된다.

### 사용 방법

```shell
git rebase [upstream branch]
```

#### `--onto` 옵션

```shell
git rebase --onto <newbase> <upstream> <branch>
```

rebase를 사용하면 분기 시작점 부터 모든 커밋을 재배치에 포함시킨다. 예를 들어 

```shell
    o---o---o---o---o  master
         \
          o---o---o---o---o  next
                           \
                            o---o---o  topic
```

이런 브랜치 형태에서 topic을 최신 master 위치로 붙이고 싶은데 `git rebase master`를 실행하면 next 브랜치와 함께 master에 붙게된다. 이런 경우 rebase에 제외시킬 브랜치 변경사항은 `onto` 옵션을 붙여 사용하면 된다.

```shell
git rebase master next topic
```

이렇게 실행하면

```shell
    o---o---o---o---o  master
        |            \
        |             o'--o'--o'  topic
         \
          o---o---o---o---o  next
```

이렇게 next를 제외한 topic의 변경사항만 master 브랜치에 붙일 수 있다.

히스토리를 삭제하는 명령어이기 때문에 이미 다른 개발자들과 공유된 변경사항이 있다면 rebase는 쓰지 않는것이 권장된다. 하지만 아직 push 되지 않은 개인 커밋들을 정리하기에는 좋다. 

## squash

여러 개의 커밋을 하나로 합치는 명령어이다. 디테일한 커밋 내용을 잃게 되기 때문에 사용에 주의가 필요하다. squash는 단일 명령어로 제공되는 기능은 아니다. rebase 명령어에 옵션을 사용해 달성할 수 있다.

### 사용 방법

최신 커밋으로부터 이전 3개의 커밋을 합치고 싶을 때 아래와 같은 명령어를 입력하면 

```shell
git rebase -i HEAD~3
```

텍스트 편집기가 열린다.

```shell
pick abc1234 커밋1
pick def5678 커밋2  
pick ghi9012 커밋3  
```

여기서 합칠 커밋들에 `pick`을 `squash`로 변경하고 저장하면 된다.

```shell
pick abc1234 커밋1
squash def5678 커밋2   ← 이전 커밋에 합치기
squash ghi9012 커밋3   ← 이전 커밋에 합치기
```

merge를 실행할때도 squash 옵션을 사용하면 모든 커밋을 뭉쳐서 가져오게 된다. 

## 참고
- [Git document](https://git-scm.com/docs)
