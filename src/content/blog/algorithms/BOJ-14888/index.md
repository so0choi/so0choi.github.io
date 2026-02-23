---
title: "[BOJ] 14888. 연산자 끼워넣기"
description: '문제 링크 문제 N개의 수로 이루어진 수열 A1, A2, ..., AN이 주어진다. 또, 수와 수 사이에 끼워넣을 수 있는 N 1개의 연산자가 주어진다. 연산자는 덧셈(+), 뺄셈( ), 곱셈(×), 나눗셈(÷)으로만 이루어져 있다. 우리는 수와 수 사이에 연산자를 하나씩 넣어서, 수식을 하나 만들 수 있다. 이때, 주…'
heroImage: './2020-09-18-17-51-08.png'
pubDate: 2020-09-18 17:45:10
tags:
  - BOJ
  - BFS/DFS
category: algorithms





---



[문제 링크](https://www.acmicpc.net/problem/14888)

## 문제

N개의 수로 이루어진 수열 A1, A2, ..., AN이 주어진다. 또, 수와 수 사이에 끼워넣을 수 있는 N-1개의 연산자가 주어진다. 연산자는 덧셈(+), 뺄셈(-), 곱셈(×), 나눗셈(÷)으로만 이루어져 있다.

우리는 수와 수 사이에 연산자를 하나씩 넣어서, 수식을 하나 만들 수 있다. 이때, 주어진 수의 순서를 바꾸면 안 된다.

예를 들어, 6개의 수로 이루어진 수열이 1, 2, 3, 4, 5, 6이고, 주어진 연산자가 덧셈(+) 2개, 뺄셈(-) 1개, 곱셈(×) 1개, 나눗셈(÷) 1개인 경우에는 총 60가지의 식을 만들 수 있다. 예를 들어, 아래와 같은 식을 만들 수 있다.

- 1+2+3-4×5÷6
- 1÷2+3+4-5×6
- 1+2÷3×4-5+6
- 1÷2×3-4+5+6

식의 계산은 연산자 우선 순위를 무시하고 앞에서부터 진행해야 한다. 또, 나눗셈은 정수 나눗셈으로 몫만 취한다. 음수를 양수로 나눌 때는 C++14의 기준을 따른다. 즉, 양수로 바꾼 뒤 몫을 취하고, 그 몫을 음수로 바꾼 것과 같다. 이에 따라서, 위의 식 4개의 결과를 계산해보면 아래와 같다.

- 1+2+3-4×5÷6 = 1
- 1÷2+3+4-5×6 = 12
- 1+2÷3×4-5+6 = 5
- 1÷2×3-4+5+6 = 7

N개의 수와 N-1개의 연산자가 주어졌을 때, 만들 수 있는 식의 결과가 최대인 것과 최소인 것을 구하는 프로그램을 작성하시오.

## 입력

첫째 줄에 수의 개수 N(2 ≤ N ≤ 11)가 주어진다. 둘째 줄에는 A1, A2, ..., AN이 주어진다. (1 ≤ Ai ≤ 100) 셋째 줄에는 합이 N-1인 4개의 정수가 주어지는데, 차례대로 덧셈(+)의 개수, 뺄셈(-)의 개수, 곱셈(×)의 개수, 나눗셈(÷)의 개수이다.

## 출력

첫째 줄에 만들 수 있는 식의 결과의 최댓값을, 둘째 줄에는 최솟값을 출력한다. 연산자를 어떻게 끼워넣어도 항상 -10억보다 크거나 같고, 10억보다 작거나 같은 결과가 나오는 입력만 주어진다. 또한, 앞에서부터 계산했을 때, 중간에 계산되는 식의 결과도 항상 -10억보다 크거나 같고, 10억보다 작거나 같다.

## 입출력 예제

예제 1

```
# 입력
2
5 6
0 0 1 0
# 출력
30
30
```

예제 2

```
# 입력
3
3 4 5
1 0 1 0
# 출력
35
17
```

예제 3

```
# 입력
6
1 2 3 4 5 6
2 1 1 1
# 출력
54
-24
```

## 풀이

이 문제는 itertools 모듈의 라이브러리를 사용할 수도 있고 DFS 혹은 BFS를 사용해서도 풀 수 있다.
나는 `permutations`를 사용하는 풀이와, `DFS`를 사용해 풀이해봤는데 둘의 성능차이가 정말 많이 났다.

![](./2020-09-18-17-51-08.png)

_시간 차이가 거의 6배나 난다_

### DFS 풀이

```python
import sys
n =int(sys.stdin.readline().rstrip())
num = list(map(int, sys.stdin.readline().rstrip().split()))
add, sub, mul, div = list(map(int, sys.stdin.readline().rstrip().split()))

min_ans = 9876543210
max_ans = -9876543210

def dfs(i, result):
    global add, sub, mul, div, min_ans, max_ans
    if i == n:
        if result > max_ans: max_ans = result
        if result < min_ans: min_ans = result
    else:
        if add:
            add-=1
            dfs(i+1, result+num[i])
            add+=1
        if sub:
            sub-=1
            dfs(i+1, result-num[i])
            sub+=1
        if mul:
            mul-=1
            dfs(i+1, result*num[i])
            mul+=1
        if div:
            div-=1
            dfs(i+1, int(result/num[i]))
            div+=1
dfs(1, num[0])
print(max_ans, min_ans, sep='\n')
```

나누기를 할 때 `//` 연산자만 사용해서는 정답이 나오지 않는다. 이유는 정확히 파악하지 못했다.

### Permutations 풀이

```python
import sys
from itertools import permutations
n = int(sys.stdin.readline().rstrip())
num = list(map(int, sys.stdin.readline().rstrip().split()))
oper = list(map(int, sys.stdin.readline().rstrip().split()))
oper_s = '+' * oper[0] + '-' * oper[1] + '*' * oper[2] + '/' * oper[3]

def cal(oper):
    ans = num[0]
    for i in range(1,n):
        op = oper[i-1]
        if op == '+':
            ans += num[i]
        elif op == '-':
            ans -= num[i]
        elif op == '*':
            ans *= num[i]
        else:
            if ans < 0:
                temp = abs(ans) // num[i]
                ans = -temp
            else:
                ans //= num[i]
    return ans

ans_max = -9876543210
ans_min = 9876543210

permu = set(permutations(oper_s))
for p in permu:
    result = cal(p)
    if ans_max < result: ans_max = result
    if ans_min > result: ans_min = result

print(ans_max)
print(ans_min)
```

각 연산자의 갯수와 연사자를 곱해 문자열로 만들고 해당 문자열로 순열을 조합한 결과에 중복을 제거하는 `set`을 사용했다.

질문 게시판을 살펴보니 `백트래킹` 으로 풀면 매우 빠르게 풀 수 있는 것 같다. 나중에 공부하고 풀어봐야겠다.
