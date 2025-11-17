---
title: "[BOJ] 14502. 연구소"
description: '연구소 문제 링크 문제 인체에 치명적인 바이러스를 연구하던 연구소에서 바이러스가 유출되었다. 다행히 바이러스는 아직 퍼지지 않았고, 바이러스의 확산을 막기 위해서 연구소에 벽을 세우려고 한다. 연구소는 크기가 N×M인 직사각형으로 나타낼 수 있으며, 직사각형은 1×1 크기의 정사각형으로 나누어져 있다. 연구소는 빈 칸,…'
pubDate: 2020-09-11 23:25:52
tags:
  - Algorithm
  - BOJ
  - BFS/DFS
category: Algorithm

---


# 연구소

[문제 링크](https://www.acmicpc.net/problem/14502)

## 문제

인체에 치명적인 바이러스를 연구하던 연구소에서 바이러스가 유출되었다. 다행히 바이러스는 아직 퍼지지 않았고, 바이러스의 확산을 막기 위해서 연구소에 벽을 세우려고 한다.

연구소는 크기가 N×M인 직사각형으로 나타낼 수 있으며, 직사각형은 1×1 크기의 정사각형으로 나누어져 있다. 연구소는 빈 칸, 벽으로 이루어져 있으며, 벽은 칸 하나를 가득 차지한다.

일부 칸은 바이러스가 존재하며, 이 바이러스는 상하좌우로 인접한 빈 칸으로 모두 퍼져나갈 수 있다. 새로 세울 수 있는 벽의 개수는 3개이며, 꼭 3개를 세워야 한다.

## 입력

첫째 줄에 지도의 세로 크기 N과 가로 크기 M이 주어진다. (3 ≤ N, M ≤ 8)

둘째 줄부터 N개의 줄에 지도의 모양이 주어진다. 0은 빈 칸, 1은 벽, 2는 바이러스가 있는 위치이다. 2의 개수는 2보다 크거나 같고, 10보다 작거나 같은 자연수이다.

빈 칸의 개수는 3개 이상이다.

## 출력

첫째 줄에 얻을 수 있는 안전 영역의 최대 크기를 출력한다.

## 예제 입출력

예제 1

```
# 입력
7 7
2 0 0 0 1 1 0
0 0 1 0 1 2 0
0 1 1 0 1 0 0
0 1 0 0 0 0 0
0 0 0 0 0 1 1
0 1 0 0 0 0 0
0 1 0 0 0 0 0
# 출력
27
```

예제 2

```
# 입력
4 6
0 0 0 0 0 0
1 0 0 0 0 2
1 1 1 0 0 2
0 0 0 0 0 2
# 출력
9
```

## 풀이

전형적인 DFS/BFS 문제이다. 전체 맵의 크기가 크지 않다. 최대 `8X8` 크기의 맵에서 바이러스의 최소 갯수는 `2` 이므로, 벽을 세울 수 있는 최대 연산해야 하는 조합의 수는 61C3 = 35990 이다. `100000`번 보다 작은 수 이기 때문에 제한시간 `2초`안에 충분히 모든 경우를 계산해 풀 수 있는 부르트 포스 알고리즘 문제이다.

_실제로 예전에 몇 번 코딩테스트를 봤을 때 자주 봤던 유형이다. 필수적으로 풀 줄 알아야 하는 유형이라고 생각한다!_

벽을 놓는 조합을 구하는 방법과 바이러스를 퍼지게 하는 방법에 모두 BFS 또는 DFS를 사용할 수 있다. 파이썬을 사용하는 경우 조합을 구하는 `Permutations` 모듈을 사용할 수도 있다.

나는 혼자 풀이할 때 벽을 놓는데 DFS, 바이러스 확산에 BFS를 사용하고 조합 라이브러리를 이용한 풀이도 제출해봤다. 라이브러리를 이용하는 것이 약간 더 빨랐다.

하지만 다른 사람들의 코드를 보니 내 코드가 현저히 느리게 동작했다. 일단 조합을 구하는 내 코드가 비효율적인 것 같다.

## 소스 코드

### 조합 직접 구현

```python
from collections import deque
import sys
n, m = map(int,input().split())
no_safe = 3
board = []
virus = []
for i in range(n):
    board.append(list(map(int, sys.stdin.readline().rstrip().split())))
    for j in range(m):
        if board[i][j] == 2:
            virus.append((i,j))
            no_safe +=1
        elif board[i][j] == 1:
            no_safe +=1

dx = [0,1,0,-1]
dy = [1,0,-1,0]

def check(board):
    visited = [[False]*m for _ in range(n)]
    result = n*m - no_safe
    for v in virus:
        vx,vy = v[0],v[1]
        q = deque([(vx,vy)])
        visited[vx][vy]==1
        while q:
            cur = q.popleft()
            x,y = cur[0],cur[1]
            for d in range(4):
                nx,ny = x+dx[d], y+dy[d]
                if 0<=nx<n and 0<=ny<m and board[nx][ny]==0 and visited[nx][ny]==False:
                    visited[nx][ny] = True
                    result-=1
                    q.append((nx,ny))
    return result

def sol(board,n_wall,last_i,last_j,ans):
    if n_wall == 0:
        return check(board)
    for j in range(last_j,m):
        if board[last_i][j]==0:
            board[last_i][j]=1
            new_ans= sol(board, n_wall-1, last_i, j,ans)
            ans = max(ans, new_ans)
            board[last_i][j] = 0
    for i in range(last_i+1,n):
        for j in range(m):
            if board[i][j]==0:
                board[i][j]=1
                new_ans= sol(board, n_wall-1, i, j,ans)
                ans = max(ans, new_ans)
                board[i][j]=0
    return ans

print(sol(board,3,0,0,-1))
```

### itertools.combinations 사용

```python
from collections import deque
from itertools import combinations
import sys
n, m = map(int,input().split())
no_safe = 3
board = []
virus = []
safe = []
for i in range(n):
    board.append(list(map(int, sys.stdin.readline().rstrip().split())))
    for j in range(m):
        if board[i][j] == 2:
            virus.append((i,j))
            no_safe +=1
        elif board[i][j] == 1:
            no_safe +=1
        else:
            safe.append((i,j))

dx = [0,1,0,-1]
dy = [1,0,-1,0]

def check(board):
    visited = [[False]*m for _ in range(n)]
    result = n*m - no_safe
    for v in virus:
        vx,vy = v[0],v[1]
        q = deque([(vx,vy)])
        visited[vx][vy]==1
        while q:
            cur = q.popleft()
            x,y = cur[0],cur[1]
            for d in range(4):
                nx,ny = x+dx[d], y+dy[d]
                if 0<=nx<n and 0<=ny<m and board[nx][ny]==0 and visited[nx][ny]==False:
                    visited[nx][ny] = True
                    result-=1
                    q.append((nx,ny))
    return result

def sol():
    ans = -1
    for permu in combinations(safe, 3):
        for p in permu:
            board[p[0]][p[1]] = 2
        cal = check(board)
        ans = max(cal, ans)
        for p in permu:
            board[p[0]][p[1]] = 0
    return ans

print(sol())
```
