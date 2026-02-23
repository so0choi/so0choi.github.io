---
title: "[BOJ] 11724. 연결 요소의 개수"
description: '문제 방향 없는 그래프가 주어졌을 때, 연결 요소 (Connected Component)의 개수를 구하는 프로그램을 작성하시오. 입력 첫째 줄에 정점의 개수 N과 간선의 개수 M이 주어진다. (1 ≤ N ≤ 1,000, 0 ≤ M ≤ N×(N 1)/2) 둘째 줄부터 M개의 줄에 간선의 양 끝점 u와 v가 주어진다. (1…'
pubDate: 2020-08-19 23:32:06
tags:
  - BOJ
  - BFS/DFS
category: algorithms




---


[문제](https://www.acmicpc.net/problem/11724)

방향 없는 그래프가 주어졌을 때, 연결 요소 (Connected Component)의 개수를 구하는 프로그램을 작성하시오.

## 입력

첫째 줄에 정점의 개수 N과 간선의 개수 M이 주어진다. (1 ≤ N ≤ 1,000, 0 ≤ M ≤ N×(N-1)/2) 둘째 줄부터 M개의 줄에 간선의 양 끝점 u와 v가 주어진다. (1 ≤ u, v ≤ N, u ≠ v) 같은 간선은 한 번만 주어진다.

## 출력

첫째 줄에 연결 요소의 개수를 출력한다.

## 풀이

연결된 요소를 구하는 문제다. 그래프는 연결리스트 구조로 만들었다. BFS를 사용해서 구현해 문제를 풀었다.
`visited`를 list로 구현할 경우 탐색에 O(N)이 소요되므로 `set`으로 구현하자.
방문되지 않은 노드를 찾을 때 마다 연결된 요소의 수를 저장하는 `ans`를 1씩 증가 시켜주고 해당 노드와 연결된 모든 노드들을 찾아 `queue`에 추가하면서 모두 방문하는 방식으로 코드를 짰다.

### BFS

```python
from collections import deque
import sys
input = sys.stdin.readline
n,m = map(int, input().split())
graph = [[] for i in range(n+1)]
for _ in range(m):
    a,b = map(int,input().split())
    graph[a].append(b)
    graph[b].append(a)
visited = set()
q = deque()
ans = 0
for i in range(1,n+1):
    if i not in visited:
        ans+=1
        q.append(i)
        visited.add(i)
        while q:
            cur = q.popleft()
            for node in graph[cur]:
                if node not in visited:
                    visited.add(node)
                    q.append(node)
print(ans)
```

### DFS

```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)
n,m = map(int, input().split())
graph = [[] for i in range(n+1)]
for _ in range(m):
    a,b = map(int,input().split())
    graph[a].append(b)
    graph[b].append(a)
def DFS(graph, v, visited):
    if v in visited:
        return
    visited.add(v)
    for node in graph[v]:
        DFS(graph, node, visited)
ans = 0
visited = set()
for i in range(1,n+1):
    if i not in visited:
        ans+=1
        DFS(graph, i, visited)
print(ans)
```
