---
title: Javascript 30 Day 17
description: 'Day 17 Sort Without Articles Articles : 관사, 즉 관사 없이 영어 문자열을 배열하는 방법이다. 완성본 기존 데이터 sorting 이후 소스 코드 sort를 하기 위해서 를 사용한다. 는 두개의 인자를 받는다. , 를 받는다고 했을 때 가 더 크면 을 반환하고 그렇지 않은 경우 을 반환한다…'
heroImage: './2020-10-03-21-20-31.png'
pubDate: 2020-10-03 21:17:55
tags:
  - Javascript
  - Javascript30
category: Javascript


---



# Day 17 - Sort Without Articles

Articles : 관사, 즉 관사 없이 영어 문자열을 배열하는 방법이다.

## 완성본

기존 데이터

```js
const bands = [
  "The Plot in You",
  "The Devil Wears Prada",
  "Pierce the Veil",
  "Norma Jean",
  "The Bled",
  "Say Anything",
  "The Midway State",
  "We Came as Romans",
  "Counterparts",
  "Oh, Sleeper",
  "A Skylit Drive",
  "Anywhere But Here",
  "An Old Dog",
];
```

sorting 이후

![](./2020-10-03-21-20-31.png)

## 소스 코드

sort를 하기 위해서 `Array.ProtoType.sort()`를 사용한다.
`sort()`는 두개의 인자를 받는다. `a`, `b`를 받는다고 했을 때 `a`가 더 크면 `1`을 반환하고 그렇지 않은 경우 `-1`을 반환한다. 이는 숫자 뿐만아니라 `>`/ `<` 연산자를 사용해 문자열에도 그대로 적용할 수 있다.

문자열이 'a', 'an', 'the'로 시작하는 경우 관사를 없애고 비교해야 하기 때문에 관사를 없애는 함수 `strip`을 생성해준다.

```js
function strip(bandName) {
  return bandName.replace(/^(a |the |an )/i, "").trim();
}
```

문자열의 조작은 정규식을 사용하는 것이 간편하다. [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/%EC%A0%95%EA%B7%9C%EC%8B%9D)에서 사용법을 찾아볼 수 있다. 짧게 설명하자면 아래와 같다.

- ^ : 문자열의 시작 문자를 찾는다
- x|y : x혹은 y에 대응하는 문자를 찾는다
- i : 소문자 대문자 구분없이 모두 찾는다

이에 해당하는 문자열을 찾을 경우 `replace()`로 관사를 없애고 관사뒤에 있던 공백은 `trim()`으로 지워준다.

이 `strip()` 함수를 각 bandName 들에 적용시킨 값을 sort 함수에 적어주면 된다.

```js
const sortedBands = bands.sort((a, b) => (strip(a) > strip(b) ? 1 : -1));
```

sorting이 끝난 값들을 화면에 프린트시킨다.

```js
document.querySelector("#bands").innerHTML = sortedBands
  .map((band) => `<li>${band}</li>`)
  .join("");
```

여기서 주의할 점은 뒤에 `join('')`을 붙인다는 것이다. `innerHTML`을 지정할 때 자바스크립트는 `toString()`을 사용하는데 배열에 `toString()`이 사용되면 default로 각 요소 사이에 `,`를 붙인다. 그래서 `join('')`없이 출력하면 `</li>` 뒤에 `,`가 추가되어있는 것을 볼 수 있다.
