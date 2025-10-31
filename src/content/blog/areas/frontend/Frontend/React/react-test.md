---
title: React 컴포넌트 테스트 하기
description: '테스트에 사용한 라이브러리는 과 이다. React 뿐만 아니라 UI 컴포넌트 테스트를 위한 툴을 가지고 있는 패키지이다. test runner는 패키지에 포함되어 있지 않으며 사용자가 원하는 테스트 프레임워크를 사용하면 된다. 를 사용하지 않고도 테스트를 할 수는 있지만 이 라이브러리를 사용하면 테스트에 필요한 세부 코…'
pubDate: 2024-10-20 17:56:29
category: React
tags:
  - test

---


테스트에 사용한 라이브러리는 `@testing-library`과 `jest`이다.
`@testing-library` React 뿐만 아니라 UI 컴포넌트 테스트를 위한 툴을 가지고 있는 패키지이다. test runner는 패키지에 포함되어 있지 않으며 사용자가 원하는 테스트 프레임워크를 사용하면 된다.

`@testing-library`를 사용하지 않고도 테스트를 할 수는 있지만 이 라이브러리를 사용하면 테스트에 필요한 세부 코드 작성을 줄려주기 때문에 사용하는 것이 좋다. 더 궁금하면 이 글을 읽어보면 좋을 것 같다. ([Testing implementation details](https://kentcdodds.com/blog/testing-implementation-details))

## act

테스트에 사용하는 React API로 `act`가 있다. 도큐먼트에서는 컴포넌트에 변화가 생기는 작업을 수행할 때 `act`로 감싸라고 한다. 

```javascript
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

공식 문서에서는 `await`, `async`와 함께 쓸 것을 권장한다. sync 버전도 대부분의 경우 잘 동작하지만 예기치 못한 이상 동작이 발생할 수 있기 때문이라고 한다. 특이 사항이 없다면 권장 내용을 따르는 게 좋을 듯 하다.

## 유저 동작 발생시키기

`@testing-library`의 `fireEvent`를 이용하여 유저 액션을 만들 수 있다.

스펙은 다음과 같다.

- `fireEvent(node: HTMLElement, event: Event)`
- `fireEvent[eventName](node: HTMLElement, eventProperties: Object)`

`eventName`은 HTML element 이벤트명과 같은 이름을 가지고 있다. 자동완성 옵션으로 쉽게 불러와서 사용할 수 있지만 [여기](https://github.com/testing-library/dom-testing-library/blob/main/src/event-map.js)서 사용 가능한 옵션 리스트를 확인할 수 있다.
아래 예시와 같은 방식으로 사용하면 된다. 

```js
await act(async () => {
    fireEvent.change(email, { target: { value: formData.email } });
    fireEvent.change(password, { target: { value: formData.password } });
    fireEvent.click(submitBtn);
});
expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
expect(mockedMutationResponse).toHaveBeenCalledWith({
    loginInput: formData,
}); 
```

## 정리

`act`를 async-await 문으로 감싸고 그 내부에 돔 조작 등 유저 이벤트를 발생시킨 후, assertion문을 실행하면 된다.