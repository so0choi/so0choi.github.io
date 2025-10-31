---
title: Sorting
description: '🚨 ’이것이 취업을 위한 코딩테스트다’ 교재 정리 정렬 정렬을 위한 알고리즘은 여러가지가 있다. 대부분 언어의 라이브러리에는 이미 효율적인 정렬 라이브러리를 제공하고 있지만 기본적으로 정렬 알고리즘의 원리를 이해하고 있는 것도 기업 면접에도 많이 등장하는 문제이기 때문에 중요하다고 한다. 선택 정렬 가장 단순하고 직관…'
pubDate: 2020-08-23 20:03:47
tags:
  - Algorithm
category: Algorithm

---


🚨 '이것이 취업을 위한 코딩테스트다' 교재 정리

# 정렬

정렬을 위한 알고리즘은 여러가지가 있다. 대부분 언어의 라이브러리에는 이미 효율적인 정렬 라이브러리를 제공하고 있지만 기본적으로 정렬 알고리즘의 원리를 이해하고 있는 것도 기업 면접에도 많이 등장하는 문제이기 때문에 중요하다고 한다.

## 선택 정렬

가장 단순하고 직관적으로 떠올릴 수 있는 정렬 방법이다. 배열에서 가장 작은 값을 선택해 차례대로 정렬하는 알고리즘이다.

```python
data = [3,6,7,1,2,9,10,4,5,8]
def selection_sort():
    for i in range(len(data)):
        idx = i
        for j in range(i,len(data)):
            if data[idx] > data[j]:
                idx = j
        data[idx],data[i] = data[i],data[idx]
selection_sort()
print(data)
```

선택정렬의 시간 복잡도는 O(N^2)이다. 효율적이라고는 할 수 없다.

## 삽입 정렬

삽입 정렬은 앞에서 부터 정렬하여 각 원소가 들어갈 자리를 찾아 해당 위치에 삽입하는 정렬 알고리즘이다. n번재 원소가 들어갈 위치를 찾는다면 0 부터 n-1 번째 까지의 원소를 차례대로 확인한다. 앞에서부터 정렬이 진행되기 때문에 `data[:n]` 의 원소들은 이미 정렬된 상태이다. 따라서 n번재 원소가 들어갈 위치는 해당 원소보다 큰 수를 만나 그 위치에 넣는다고 생각하면 된다.

```python
data = [3,6,7,1,2,9,10,4,5,8]
def insertion_sort():
    for i in range(1,len(data)):
        for j in range(i,0,-1):
            if data[j] < data[j-1]:
                data[j],data[j-1] = data[j-1],data[j]
            else:
                break
insertion_sort()
print(data)
```

for문이 2번 중첩되고 있기 때문에 시간 복잡도는 O(N^2)이다. 하지만 삽입정렬의 경우 데이터가 거의 되어있는 상황에서는 매우 빠르게 동작한다. 최선의 경우 O(N)의 시간 복잡도를 가진다. 따라서 그럴 경우 퀵 정렬보다 빠르게 동작한다.

## 퀵 정렬

퀵 정렬은 *가장 빠른 정렬 알고리즘*이다. 주 아이디어는 기준 값을 정해 그 기준보다 큰 값과 작은 값의 위치를 바꾸는 것이다. 이 기준 값을 `pivot`이라고 한다.
pivot 값 보다 작은 그룹과 pivot 값 보다 큰 그룹을 분할하면 두 그룹은 pivot 값을 기준으로 정렬된다. 그렇게 분할된 두 그룹에 대해서 다시한번 정렬을 수행하는 방식이다.
pivot을 어떤 값으로 정하는 것이 적절한지는 다양한 알고리즘 논문에서 설명하고 있다. 이번에는 배열의 첫번째 값을 pivot으로 설정하는 '호어 분할 방식'으로 포스팅을 한다.

```python
data = [3,6,7,1,2,9,10,4,5,8]
def quick_sort(start, end):
    if start >= end:
        return
    pivot = start
    left = start+1
    right = end
    while left <= right:
        # pivot 보다 큰 값이 왼쪽에 있는 경우를 찾는다
        while left <= end and data[pivot] > data[left]:
            left += 1
        # pivot 보다 작은 값이 오른쪽에 있는 경우를 찾는다
        while right > start and data[pivot] < data[right]:
            right -= 1
        # pivot을 기준으로 정렬이 끝난 상태
        if left > right:
            data[pivot], data[right] = data[right], data[pivot]
        else:
            data[left], data[right] = data[right], data[left]
    # 왼쪽과 오른쪽 그룹 재정렬
    quick_sort(start, right-1)
    quick_sort(right+1, end)
quick_sort(0,len(data)-1)
print(data)
```

부분 sorting이 한 번 발생하면 최종적으로 `right`위치에 pivot값이 이동하므로 다음 그룹 sorting은 pivot 값을 제외한 왼쪽과 오른쪽 그룹에 시행하면 된다.

### 파이썬을 최대로 활용한 퀵소트 코드

```python
data = [3,6,7,1,2,9,10,4,5,8]
def quick_sort_python(data):
    if len(data) <=1:
        return data
    pivot = data[0]
    tail = data[1:]
    left = [x for x in data if x < pivot]
    right = [x for x in data if x > pivot]
    return quick_sort_python(left) + [pivot] + quick_sort_python(right)
print(quick_sort_python(data))
```

퀵 정렬의 시간 복잡도는 O(NlogN) 이다. 상당히 빠르다. 라이브러리에 내장되어있는 정렬 함수도 퀵소트를 기반으로 한다. 하지만 퀵소트는 데이터가 이미 정렬되어있을 경우 pivot 값에 따라 매우 느리게 동작할 수 있다. 라이브러리에서는 빠른 정렬을 위해 최적의 pivot값을 선택함을 보장해주기 때문에 걱정하지 않아도 된다.

## 계수 정렬

계수정렬은 백준에서 문제를 풀다가 몇 번 본적이 있는데, ([백준 문제 링크](https://www.acmicpc.net/problem/10989)) 다른 알고리즘 책에서 다루는 것은 보지 못했다. 하지만 경우에 따라 매우 빠르게 동작하기 때문에 알아 두는 것이 좋을 것 같다. 계수 정렬은 **데이터의 크기 범위가 제한되어 정수 형태로 표현할 수 있을 때**만 사용할 수 있다. 일반적으로 가장 큰 데이터와 가장 작은 데이터의 차이가 1,000,000을 넘지 않을 때 효과적이다.

알고리즘 아이디어는 n 개의 숫자가 있다면 가장 큰 수 만큼 크기의 배열을 만들어 0으로 채우고 반복문을 한 번 수행하면서 해당 숫자에 해당하는 index를 증가시켜 이 배열을 출력하는 것이다.

```python
data = [3,6,7,1,2,9,10,4,5,8]
count = [0]*(max(data)+1)
for i in data:
    count[i]+=1
for i in range(len(count)):
    for j in range(count[i]):
        print(i,end=' ')
```

매우 간단하다! 계수 정렬의 시간 복잡도는 O(N+K)이다. (K는 데이터의 최대값) 데이터의 크기가 많이 중복되어 있을 수록 유리하다.

## 결론

정렬 라이브러리는 항상 O(NlogN)을 보장한다. 따라서 단순 정렬 작업에는 기본 라이브러리를 사용하고, 데이터의 범위가 한정적이고 더 빠르게 동작해야 할 때는 계수 정렬을 사용하자.
