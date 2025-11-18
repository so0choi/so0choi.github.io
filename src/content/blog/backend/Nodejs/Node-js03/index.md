---
title: "[Node.js] 동기 & 비동기"
description: 'Synchronous & Asynchronous 동기 vs 비동기 ’동기’와 ’비동기’는 그 이름 그대로 동작한다. 동기적 작업 방식은 작업이 순차적으로 진행된다. A B C 가 호출이 되면, 각각의 작업이 하나씩 끝날 때 마다 다음 작업이 시작되는 것이다. 반면에 비동기적 작업 방식은 비동기적으로 동시에 작업이 진행된…'
pubDate: 2020-08-19 00:37:06
tags:
  - Node.js
  - Javascript
category: backend




---

# Synchronous & Asynchronous

## 동기 vs 비동기
'동기'와 '비동기'는 그 이름 그대로 동작한다. 
동기적 작업 방식은 작업이 순차적으로 진행된다. 
A - B - C 가 호출이 되면, 각각의 작업이 하나씩 끝날 때 마다 다음 작업이 시작되는 것이다.
반면에 비동기적 작업 방식은 비동기적으로 동시에 작업이 진행된다.
A - B - C 로 코드를 짜더라도 파일을 읽어온다거나, 서버에 접속해서 데이터를 fetch 해온다거나 하는 등의 작업을 명령하면, 수행시간이 빠른 코드들이 비동기적으로 진행되는 작업방식에 의해 먼저 완료 되어 그 결과가 더 빨리 나타난다. 따라서 작업 수행 시간이 동기적 방식에 비해 단축될 수 있다.

Node.js는 기본적으로 비동기적 방식을 따른다. 메서드들은 default가 비동기로 되어있고 보통 동기적 방식의 함수들은 `Sync`가 붙어있다. 

동기적 File Read 소스 코드
```js
 console.log("A");
 var result = fs.readFileSync("syntax/sample.txt", "utf8");
 console.log(result);
 console.log("C");
```

실행 결과
```
A
B
C
```

비동기적 File Read 소스 코드
```js
console.log("A");
fs.readFile("syntax/sample.txt", "utf8", function (err, result) {
  console.log(result);
});
console.log("C");
```

실행 결과
```
A
C
B
```

파일을 읽어오는 작업은 출력 작업보다 오래 걸리기 때문에 이후에 수행된 것이다.

비동기 함수는 동기적 함수와 달리 `callback`함수를 인자로 받는다. callback 함수는 비동기적 함수의 동작이 완료된 후에 무조건 실행되는 함수를 지정하는 것이다.

### callback
함수는 다양한 방식으로 선언할 수 있다. 일반적으로 선언하는 방식은 `function 함수이름` 방식이다.
```js
function a() {
    console.log('A');
}
```
이 함수는 다음과 같이 쓸 수 있다.
```JS
var a = function () {
  console.log("A");
};
```
어떤 함수의 callback 함수를 지정하기 위해서 함수의 인자로 callback 함수를 전달할 수 있다. 다음과 같이 사용하면 된다.
```js
function slowFunc(callback){
    callback();
}
```
그리고 `slowFunc()`함수를 부를 때 다른 함수를 인자로 넘겨주면 되는 것이다.
```js
slowFunc(a);
```
이렇게 하면 위에 선언한 `a`함수가 실행된다.
