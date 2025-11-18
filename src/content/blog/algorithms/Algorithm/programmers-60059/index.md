---
title: "[프로그래머스] Lock and key"
description: '문제 링크 구현 문제이다. 문제에서 요구하는 조건을 잘 파악해 모두 구현하면 풀어낼 수 있다. 문제 고고학자인 튜브는 고대 유적지에서 보물과 유적이 가득할 것으로 추정되는 비밀의 문을 발견하였습니다. 그런데 문을 열려고 살펴보니 특이한 형태의 자물쇠로 잠겨 있었고 문 앞에는 특이한 형태의 열쇠와 함께 자물쇠를 푸는 방법…'
pubDate: 2020-08-30 23:38:20
tags:
  - Programmers
  - Algorithm
category: algorithms




---


[문제 링크](https://programmers.co.kr/learn/courses/30/lessons/60059)

**구현** 문제이다. 문제에서 요구하는 조건을 잘 파악해 모두 구현하면 풀어낼 수 있다.

## 문제

고고학자인 튜브는 고대 유적지에서 보물과 유적이 가득할 것으로 추정되는 비밀의 문을 발견하였습니다. 그런데 문을 열려고 살펴보니 특이한 형태의 자물쇠로 잠겨 있었고 문 앞에는 특이한 형태의 열쇠와 함께 자물쇠를 푸는 방법에 대해 다음과 같이 설명해 주는 종이가 발견되었습니다.

잠겨있는 자물쇠는 격자 한 칸의 크기가 1 x 1인 `N x N` 크기의 정사각 격자 형태이고 특이한 모양의 열쇠는 `M x M` 크기인 정사각 격자 형태로 되어 있습니다.

자물쇠에는 홈이 파여 있고 열쇠 또한 홈과 돌기 부분이 있습니다. 열쇠는 회전과 이동이 가능하며 열쇠의 돌기 부분을 자물쇠의 홈 부분에 딱 맞게 채우면 자물쇠가 열리게 되는 구조입니다. 자물쇠 영역을 벗어난 부분에 있는 열쇠의 홈과 돌기는 자물쇠를 여는 데 영향을 주지 않지만, 자물쇠 영역 내에서는 열쇠의 돌기 부분과 자물쇠의 홈 부분이 정확히 일치해야 하며 열쇠의 돌기와 자물쇠의 돌기가 만나서는 안됩니다. 또한 자물쇠의 모든 홈을 채워 비어있는 곳이 없어야 자물쇠를 열 수 있습니다.

열쇠를 나타내는 2차원 배열 `key`와 자물쇠를 나타내는 2차원 배열 `lock`이 매개변수로 주어질 때, 열쇠로 자물쇠를 열수 있으면 `true`를, 열 수 없으면 `false`를 `return` 하도록 `solution` 함수를 완성해주세요.

### 제한 사항

- key는 M x M(3 ≤ M ≤ 20, M은 자연수)크기 2차원 배열입니다.
- lock은 N x N(3 ≤ N ≤ 20, N은 자연수)크기 2차원 배열입니다.
- M은 항상 N 이하입니다.
- key와 lock의 원소는 0 또는 1로 이루어져 있습니다.
  - 0은 홈 부분, 1은 돌기 부분을 나타냅니다.

### 입출력 예

| key                       | lock                      | result |
| ------------------------- | ------------------------- | ------ |
| [[0,0,0],[1,0,0],[0,1,1]] | [[1,1,1],[1,1,0],[1,0,1]] | true   |

## 문제 풀이

문제의 제한사항이 중요하다. `N`과 `M`이 모두 `3 이상 20 이하`이므로 크기가 그렇게 크지 않다. 그렇기 때문에 완전탐색으로 문제를 풀 수 있다.
한가지 배우고 갈 점은 맵에 열쇠를 매칭할 때 작업을 수월하게 하기 위하여 맵의 크기를 `*3` 해주는 것이다. _2.5배만 해도 문제푸는데는 지장이 없다_
2차원 배열의 `rotate` 코드는 자주 나오기 때문에 외워두는 것이 좋다.
그리고 `N`과 `M`이 다르다는 점을 꼭 주의해야한다. 로직은 잘못된 곳이 없는데 계속 런타임 에러가 나서 해결하는데 꽤 오래걸렸다. :sob:

열쇠가 맵의 왼쪽 맨 윗 부분 한 칸에만 끼워졌을 경우 부터 시작해 한 위치에서 4가지 회전 방향으로 시도해보고 해결되는 경우를 찾아내면 된다.

## 소스코드

```python
def rotate(arr, n):
    temp = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            temp[j][n-i-1] = arr[i][j]
    return temp

def check(lock, n):
    for i in range(n):
        for j in range(n):
            if lock[n+i][n+j]!=1:
                return False
    return True

def solution(key, lock):
    n = len(lock)
    m = len(key)
    board = [[0]*(n*3) for _ in range(n*3)]
    for i in range(n):
        for j in range(n):
            board[i+n][j+n] = lock[i][j]
    for i in range(2*n):
        for j in range(2*n):
            for k in range(4):
                for r in range(m):
                    for c in range(m):
                        board[i+r][j+c] += key[r][c]
                if check(board, n):
                    return True
                for r in range(m):
                    for c in range(m):
                         board[i+r][j+c] -= key[r][c]
                key = rotate(key, m)
    return False
```
