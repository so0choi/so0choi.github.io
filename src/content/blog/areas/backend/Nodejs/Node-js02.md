---
title: "[Node.js] Node.js의 CRUD"
description: 'fs module File System 파일을 읽고 쓰는데 필요한 많은 메서드가 포함되어있는 모듈이다. CRUD 프로그래밍에서 CRUD란 정보를 처리하는 4가지의 기본 기능을 말한다. CRUD를 할 수 있다는 것은 그 언어의 75%는 섭렵했다고 봐도 무방하다. C Create R Read U Update D Delete…'
pubDate: 2020-08-18 22:20:37
tags: 
  - Node.js
category: Node.js

---


## fs module - File System
파일을 읽고 쓰는데 필요한 많은 메서드가 포함되어있는 모듈이다.

## CRUD
프로그래밍에서 CRUD란 정보를 처리하는 4가지의 기본 기능을 말한다. CRUD를 할 수 있다는 것은 그 언어의 75%는 섭렵했다고 봐도 무방하다.
C - Create
R - Read
U - Update
D - Delete

## Create
데이터 파일을 생성하는 기능이다. 사용자가 입력한 데이터로 파일을 생성한다.

사용자의 입력을 받기 위해서 `<form>`을 이용한다. 또한 form data를 request 객체로 부터 받아와서 이용할 수 있다.

### request.on()
클라이언트로부터 전송되는 입력값을 다룰 수 있는 메서드이다.
```js
let body = '';
request.on('data', function(data){
    body += data;
})
```
data가 한번에 많이 들어오거나 너무 많은 양의 데이터가 들어오면 오류가 발생할 수 있기 때문에 `request.on('data')`는 데이터를 일정 크기로 잘라서 전송받는다. callback function 은 한 부분의 전송이 끝나면 무조건 실행되는 함수이므로 `body` 변수에 계속해서 값이 누적되어 저장되는 것이다.

전송이 끝나면 `request.on('end')`를 실행하면 된다. 전송받은 값으로 할 작업들을 callback 함수에 명시해주면 된다.
```js
request.on('end', function(){
    var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
})
```
여기서 `302` header는 클라이언트를 redirect 시킨다는 의미이다. 이 프로그램은 사용자가 작성한 form으로 글을 생성하고 생성된 글을 출력하는 페이지로 redirect 시키고 있다.

### fs.writeFile()
위 `request.on('end)`의 callback으로 들어가있는 함수이다. `fs.writeFile('data 이름', data, encoding 정보, callback)` 문법으로 사용한다. 
```js
fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
```

## Read
데이터를 읽는 기능이다. Node.js는 다양한 데이터를 읽기위한 메서드를 제공하고 있다.
코드를 짜면서 항상 고려해야 할 사항은, 바뀌는 부분이 있을 때 그 변화가 다른 코드에 미치는 영향이 최소화 되도록 하는 것이다.

### fs.readdir
지정된 디렉토리 경로에 있는 파일들을 읽고 Array 형태로 반환한다.
문법
```js
fs.readdir('경로', function(err, fileList){
    console.log(fileList);
})
```

### fs.readfile
지정된 파일을 text 형태로 읽는다.
문법
```js
fs.readfile(`data/${queryData.id}`, 'utf8', function(err, description){
    console.log(description);
});
```
*utf8* 은 인코딩 방식을 메서드에 알려준 것이다. 이를 지정하지 않으면 파일을 정상적으로 읽을 수 없다.

## Update
파일을 수정/갱신하는 기능을 말한다.
파일을 수정할 때 주의해야 할 점은, 각 파일을 구분하는 고유한 `id`와 같은 속성이 있어야 한다는 점이다.

### fs.rename()
파일명을 바꾸는 메서드이다. 
`현재 파일명`,`변경할 파일명`, `callback`으로 구성된다.
```js
 fs.rename(`data/${id}`, `data/${title}`, function (err) {});
```

## Delete
파일을 삭제하는 기능이다. 이 또한 파일 고유 속성을 가지고 다뤄야 한다.
### fs.unlink()
파일이나 link를 삭제하는 메서드이다. 
`파일 경로, callback`으로 구성된다.
```js
fs.unlink(`data/${id}`, function (err) {
        response.writeHead(302, { Location: "/" });
        response.end();
      });
```
