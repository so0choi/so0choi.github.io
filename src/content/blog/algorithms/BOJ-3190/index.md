---
title: "[BOJ] 3190. 뱀"
description: '3190. 뱀 문제 링크 문제 ’Dummy’ 라는 도스게임이 있다. 이 게임에는 뱀이 나와서 기어다니는데, 사과를 먹으면 뱀 길이가 늘어난다. 뱀이 이리저리 기어다니다가 벽 또는 자기자신의 몸과 부딪히면 게임이 끝난다. 게임은 NxN 정사각 보드위에서 진행되고, 몇몇 칸에는 사과가 놓여져 있다. 보드의 상하좌우 끝에 벽…'
pubDate: 2020-09-05 23:33:25
tags:
  - BOJ
  - 구현
category: algorithms




---


# 3190. 뱀 [문제 링크](https://www.acmicpc.net/problem/3190)

## 문제

'Dummy' 라는 도스게임이 있다. 이 게임에는 뱀이 나와서 기어다니는데, 사과를 먹으면 뱀 길이가 늘어난다. 뱀이 이리저리 기어다니다가 벽 또는 자기자신의 몸과 부딪히면 게임이 끝난다.

게임은 NxN 정사각 보드위에서 진행되고, 몇몇 칸에는 사과가 놓여져 있다. 보드의 상하좌우 끝에 벽이 있다. 게임이 시작할때 뱀은 맨위 맨좌측에 위치하고 뱀의 길이는 1 이다. 뱀은 처음에 오른쪽을 향한다.

뱀은 매 초마다 이동을 하는데 다음과 같은 규칙을 따른다.

- 먼저 뱀은 몸길이를 늘려 머리를 다음칸에 위치시킨다.
- 만약 이동한 칸에 사과가 있다면, 그 칸에 있던 사과가 없어지고 꼬리는 움직이지 않는다.
- 만약 이동한 칸에 사과가 없다면, 몸길이를 줄여서 꼬리가 위치한 칸을 비워준다. 즉, 몸길이는 변하지 않는다.
  사과의 위치와 뱀의 이동경로가 주어질 때 이 게임이 몇 초에 끝나는지 계산하라.

## 입력

첫째 줄에 보드의 크기 N이 주어진다. (2 ≤ N ≤ 100) 다음 줄에 사과의 개수 K가 주어진다. (0 ≤ K ≤ 100)

다음 K개의 줄에는 사과의 위치가 주어지는데, 첫 번째 정수는 행, 두 번째 정수는 열 위치를 의미한다. 사과의 위치는 모두 다르며, 맨 위 맨 좌측 (1행 1열) 에는 사과가 없다.

다음 줄에는 뱀의 방향 변환 횟수 L 이 주어진다. (1 ≤ L ≤ 100)

다음 L개의 줄에는 뱀의 방향 변환 정보가 주어지는데, 정수 X와 문자 C로 이루어져 있으며. 게임 시작 시간으로부터 X초가 끝난 뒤에 왼쪽(C가 'L') 또는 오른쪽(C가 'D')로 90도 방향을 회전시킨다는 뜻이다. X는 10,000 이하의 양의 정수이며, 방향 전환 정보는 X가 증가하는 순으로 주어진다.

## 출력

첫째 줄에 게임이 몇 초에 끝나는지 출력한다.

## 풀이

문제에 주어진 요구사항을 모두 만족하는 코드를 짜면 무난하게 해결할 수 있다.
포인트는 뱀의 이동경로를 계속 파악해야 하므로, 새롭게 이동하는 위치를 계속해서 `queue`에 넣어 저장했다. `queue`를 사용한 이유는, 뱀의 머리의 새로운 위치를 `append`로 추가한다면 삭제해야 할 꼬리의 위치는 이동경로를 저장하는 자료구조의 맨 앞에 위치하기 때문에, `O(1)`로 맨 앞 원소를 뺄 수 있기 위해서였다. _다른 코드를 보니 큐를 사용하지 않아도 문제는 풀리는 것 같다_

## 소스 코드

```python
from collections import deque
n =int(input())
board = [[0]*n for _ in range(n)]
k = int(input())
for _ in range(k):
    x,y = map(int,input().split())
    board[x-1][y-1]=1
l = int(input())
op = []
for _ in range(l):
    a,b = input().split()
    op.append((int(a), b))
op = deque(op)
time=0
dx = [0,1,0,-1]
dy = [1,0,-1,0]
d_idx = 0
head = [0,0]
board[0][0] = 2
snake = deque([head])

while True:
    time+=1
    new_x, new_y = head[0]+dx[d_idx], head[1]+dy[d_idx]
    if not (0<=new_x<n and 0<=new_y<n): break #벽에 부딫힌 경우
    elif board[new_x][new_y] == 2: break #몸통 부딫힌 경우
    # 꼬리 찾기
    if board[new_x][new_y] != 1: #사과먹음
        tail_x, tail_y = snake.popleft()
        board[tail_x][tail_y] = 0
    board[new_x][new_y] = 2
    snake.append([new_x,new_y])
    head = [new_x,new_y]
    if op and time == op[0][0]:
        o_time, o_direction = op.popleft()
        if o_direction == 'L':
            d_idx = d_idx-1 if d_idx!=0 else 3
        else:
            d_idx = d_idx+1 if d_idx!=3 else 0
print(time)
```
