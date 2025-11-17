---
title: Rxjs 알아보기
description: RxJS는 비동기적이고 이벤트 기반의 프로그램을 다루기 위한 라이브러리이다. RxJS는 observable한 sequence를 사용한다...
pubDate: 2025-11-16
tags: Javascript
---

RxJS는 비동기적이고 이벤트 기반의 프로그램을 다루기 위한 라이브러리이다. RxJS는 observable한 sequence를 사용한다.
`Observable` 이라는 코어 타입을 사용하며 `Array`에서 사용되는 메서드들을 참고해 만들어졌다.
이벤트용 Lodash로 생각하면 된다.
ReactiveX는 옵저버 패턴과 이터레이터 패턴을 합쳤고, 컬렉션을 이용한 함수형 프로그래밍을 지향하며 이벤트 시퀀스를 관리하는 이상적인 방식을 제공한다.

## 기본 사용 예시

일반적으로 이벤트 리스너를 등록할 때 아래와 같이 작성한다.

```js
document.addEventListener('click', () => console.log('Clicked!'));
```

RxJS를 쓰면 다음과 같이 쓸 수 있다.

```js
import { fromEvent } from 'rxjs';

fromEvent(document, 'click').subscribe(() => console.log('Clicked!'));
```

## Purity

RxJS를 강력하게 만들어주는 기능은 순수 함수로 값을 생성해내는데에 있다. 이는 에러를 덜 만들어낸다.
보통은 아래의 방식으로 코드를 작성한다.

```js
let count = 0;
document.addEventListener('click', () => console.log(`Clicked ${++count} times`));
```

RxJS를 쓰면 다음과 같이 작성할 수 있다.

```js
import { fromEvent, scan } from 'rxjs';

fromEvent(document, 'click')
    .pipe(scan((count) => count + 1, 0))
    .subscribe((count) => console.log(`Clicked ${count} times`))
```

`scan` 연산자는 Array의 `reduce`와 동일하게 동작한다. callback에서 받는 값을 가져가 다음 callback 실행에서 input으로 들어가게 된다.

## Flow





## 주요 컨셉

- Observable: 미래에 실행가능한 컬렉션
- Observer: Observable에서 반환된 값을 기다리
- Subscription: Observable의 실행을 나타낸다. 실행을 중지할 때 유용하다.
- Operators: 함수형 프로그래밍을 가능하게 해주는 컬렉션용 순수 함수(filter, concat, reduce 등)
- Subject: EventEmitter와 동일한 개념. 여러 개의 Observer에 값이나 이벤트를 멀티캐스팅 하는 유일한 방법이다.
- Schedulers: 동시성을 컨트롤하기 위한 중앙집중형 디스패처이다.

## 참고
- [RxJS Documentation](https://rxjs.dev/guide/overview)
