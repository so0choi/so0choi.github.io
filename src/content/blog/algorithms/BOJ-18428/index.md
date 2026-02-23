---
title: "[BOJ] 18428. 감시피하기"
description: '문제 링크 문제 NxN 크기의 복도가 있다. 복도는 1x1 크기의 칸으로 나누어지며, 특정한 위치에는 선생님, 학생, 혹은 장애물이 위치할 수 있다. 현재 몇 명의 학생들은 수업시간에 몰래 복도로 빠져나왔는데, 복도로 빠져나온 학생들은 선생님의 감시에 들키지 않는 것이 목표이다. 각 선생님들은 자신의 위치에서 상, 하,…'
pubDate: 2020-09-10 01:06:02
tags:
  - BOJ
  - Algorithm
category: algorithms




---


[문제 링크](https://www.acmicpc.net/problem/18428)

## 문제

NxN 크기의 복도가 있다. 복도는 1x1 크기의 칸으로 나누어지며, 특정한 위치에는 선생님, 학생, 혹은 장애물이 위치할 수 있다. 현재 몇 명의 학생들은 수업시간에 몰래 복도로 빠져나왔는데, 복도로 빠져나온 학생들은 선생님의 감시에 들키지 않는 것이 목표이다.

각 선생님들은 자신의 위치에서 상, 하, 좌, 우 4가지 방향으로 감시를 진행한다. 단, 복도에 장애물이 위치한 경우, 선생님은 장애물 뒤편에 숨어 있는 학생들은 볼 수 없다. 또한 선생님은 상, 하, 좌, 우 4가지 방향에 대하여, 아무리 멀리 있더라도 장애물로 막히기 전까지의 학생들은 모두 볼 수 있다고 가정하자.

## 입력

첫째 줄에 자연수 N이 주어진다. (3 ≤ N ≤ 6) 둘째 줄에 N개의 줄에 걸쳐서 복도의 정보가 주어진다. 각 행에서는 N개의 원소가 공백을 기준으로 구분되어 주어진다. 해당 위치에 학생이 있다면 S, 선생님이 있다면 T, 아무것도 존재하지 않는다면 X가 주어진다.

단, 전체 선생님의 수는 5이하의 자연수, 전체 학생의 수는 30이하의 자연수이며 항상 빈 칸의 개수는 3개 이상으로 주어진다.

## 출력

첫째 줄에 정확히 3개의 장애물을 설치하여 모든 학생들을 감시로부터 피하도록 할 수 있는지의 여부를 출력한다. 모든 학생들을 감시로부터 피하도록 할 수 있다면 "YES", 그렇지 않다면 "NO"를 출력한다.

### 예제

예제 1

```
# 입력
5
X S X X T
T X S X X
X X X X X
X T X X X
X X T X X
# 출력
YES
```

예제 2

```
# 입력
4
S S S T
X X X X
X X X X
T T T X
# 출력
NO
```

## 풀이

`N`의 크기가 3이상 6 이하로 크지 않기 때문에, 부르트 포스 알고리즘(완전탐색)으로 풀이할 수 있다.
3개의 장애물을 놓는 모든 경우를 탐색하고 조건에 부합하는 조합이 나올 경우 `YES`를 출력하면 된다.

장애물을 놓는 조합은 모듈을 사용해도 되고 BFS나 DFS로 풀이할 수도 있다. 나는 DFS를 사용했다.
장애물 조합이 모든 학생들을 숨겨주는지 확인하는 함수는 따로 구현했다.

파이썬은 재귀 깊이에 limit이 있기 때문에 임의로 크기를 크게 설정해주었다.

## 소스 코드

```python
import sys
sys.setrecursionlimit(10**8)
n = int(input())
board = []
teacher = []
for i in range(n):
    board.append(sys.stdin.readline().rstrip().split())
    for j in range(n):
        if board[i][j]=='T':
            teacher.append((i,j))
def check(board):
    dx = [1,0,-1,0]
    dy = [0,1,0,-1]
    for t in teacher:
        tx,ty = t
        for d in range(4):
            nx,ny = tx+dx[d], ty+dy[d]
            while (0<=nx<n and 0<=ny<n):
                if board[nx][ny] == 'S':
                    return False
                elif board[nx][ny] == 'O':
                    break
                nx,ny = nx+dx[d], ny+dy[d]
    return True

def dfs(board,n_count,last_x,last_y):
    if n_count == 0:
        return check(board)
    for j in range(last_y,n):
        if board[last_x][j] =='X':
            board[last_x][j] = 'O'
            if dfs(board, n_count-1, last_x, j):
                return True
            board[last_x][j] = 'X'
    for i in range(last_x,n):
        for j in range(n):
            if board[i][j]=='X':
                board[i][j] = 'O'
                if dfs(board, n_count-1, i,j):
                    return True
                board[i][j] = 'X'
    return False

if dfs(board,3,0,0): print('YES')
else: print('NO')
```
