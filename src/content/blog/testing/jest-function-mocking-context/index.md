---
title: Jest function mocking과 context
description: '문제 테스트 코드를 작성하던 중 함수가 실행되었는지 테스트하는 부분이 계속 정상적으로 실행되지 않았다. 콘솔을 찍어보면 실행된 것은 확실한데 실행 횟수는 0으로 나오는 상황이었다. original.ts original.spec.ts 에러는 다음과 같았다. 하루를 날려서 알아낸 결과 가 달라서 생긴 문제였다. 으로 moc…'
pubDate: 2023-02-03 14:37:14
category: Test
tags:
  - Jest

---


## 문제

테스트 코드를 작성하던 중 함수가 실행되었는지 테스트하는 부분이 계속 정상적으로 실행되지 않았다. 콘솔을 찍어보면 실행된 것은 확실한데 실행 횟수는 0으로 나오는 상황이었다.

- original.ts
```ts
export function foo() {return 'foo'}
export function bar() {foo()}
```

- original.spec.ts
```ts
import {bar} from 'original';
const spy = jest.spyOn(
    original,
    'foo',
);

bar();
expect(spy).toBeCalled(); // assert 문 Fail!
```

에러는 다음과 같았다.

```shell
Fail
    expect(jest.fn()).toBeCalled()

    Expected number of calls: >= 1
    Received number of calls:    0
```

하루를 날려서 알아낸 결과 `context`가 달라서 생긴 문제였다.
`spyOn`으로 mock 되는 것은 테스트 파일 내 context에 한정해서 이다. 원래 파일에 있던 함수는 원본 함수 그대로일 것이다. 따라서 테스트 코드 내부에서 `foo`를 mock 했다고 해도 `bar` 내부에서 실행되는 함수는 원래 파일에 정의된 함수이기 때문에 mock된 spy의 실행 횟수는 0이 되는 것이다.

## 해결 방법

### 모듈을 분리시키기

2개의 파일을 만들어서 모듈을 따로 작성하는 방법이다.

- 'foo.ts'
```ts
function foo() { return 'foo'};
export default foo;
```

- 'original.ts'
```ts
import foo from './foo';
function bar() {foo()}
```

이렇게하면 기존 파일과 테스트 파일 모두 'foo'라는 외부 모듈에 대한 context를 사용하기 때문에 모듈 자체를 mock 함으로써 문제를 해결할 수 있다.

### export할 함수들을 따로 관리하기

- 'original.ts'
```ts
function foo() {return 'foo'}
function bar() {exportFunctions.foo}

const exportFunctions = {
    foo,
}

export default exportFunctions;
```

- 'original.spec.ts'
```ts
import original from 'original';
const spy = jest.spyOn(
    original,
    'foo',
);

bar();
expect(spy).toBeCalled(); // 1
```

## 참고
- [How to expect one function to call another function?](https://stackoverflow.com/questions/40771520/how-to-expect-one-function-to-call-another-function)
- [Mock/Spy exported functions within a single module in Jest](https://medium.com/@DavideRama/mock-spy-exported-functions-within-a-single-module-in-jest-cdf2b61af642)
