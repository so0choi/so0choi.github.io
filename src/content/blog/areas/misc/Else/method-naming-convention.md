---
title: Method Naming Convention
description: 'Apple 개발자 문서를 참고하여 정리한다. 일반적인 Rule 이름은 소문자로 시작한다. 뒤에 붙은 단어의 첫번째 글자는 대문자로 작성한다. , / 등의 문장부호는 이름에 포함시키지 않는다. (camel case 사용) 예외 케이스 통용되는 명칭을 사용하는 경우(ex. PDF) 대문자로 시작할 수 있음 여러 privat…'
pubDate: 2023-01-31 10:37:48
tags:

---


Apple 개발자 문서를 참고하여 정리한다.

## 일반적인 Rule

- 이름은 소문자로 시작한다. 뒤에 붙은 단어의 첫번째 글자는 대문자로 작성한다. _, / 등의 문장부호는 이름에 포함시키지 않는다. (camel-case 사용)
  - 예외 케이스
    - 통용되는 명칭을 사용하는 경우(ex. PDF) 대문자로 시작할 수 있음
    - 여러 private 메소드를 그룹짓고싶은 경우 대문자로 시작할 수 있음 
- private 메소드의 이름을 underscore(_) 로 사용하는것을 지양한다. (클래스 멤버 변수 이름의 경우 사용 가능)
- "do" 또는 "does"를 이름으로 사용하는 건 지양한다. 모호한 동사는 전달하는 의미가 별로 없기 때문이다.

## Accessor 메소드

- 메소드가 반환하는 정보가 명사로 표현된다면 형식을 다음과 같이 한다.
```ts
_title: string;
setTitle = (title: string) => {_title = title};
```
- 메소드가 반환하는 정보가 형용사로 표현된다면 형식을 다음과 같이 한다.
```ts
_isEditable: boolean;
setEditable = (flag: boolean) => {_isEditable = flag};
```
- 메소드가 반환하는 정보가 동사로 표현된다면 형식을 다음과 같이 한다. 동사는 현재형으로 작성해야 한다.
```ts
_showsAlpha: boolean;
setShowsAlpha = (flag: boolean) => {_showsAlpha = flag};
```
- "can", "should", "will" 은 사용할 수 있지만, "do"나 "does"는 사용하지 않는다.

| 형식         | 적합성    |
|------------|--------|
| setCanHide | ✅      |
| canHide    | ✅      |
|     setShouldCloseDocument       | ✅      |
|    setDoesAcceptGlyphInfo        | ❌      |

## 참고

- [Apple Developer](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CodingGuidelines/Articles/NamingMethods.html)



