---
title: Gulp 사용 오류 정리
description: 'Gulp 이슈 정리 Gulp 사용 실습을 따라하다 발생한 오류들을 해결했던 방법들을 정리 해놓으려한다. gulp image 설치 이슈 (ENONET) 위 에러가 발생해 이틀동안 원인을 찾았다. 는 이미지 파일을 압축하여 서버에 올려주는 작업을 해주는 라이브러리이다. gulp image npm 설치 페이지에서 다양한 옵션…'
heroImage: '../../../../../assets/posts/Node-js-18/2020-12-28-00-24-40.png'
pubDate: 2020-12-28 00:06:52
tags: 
- Gulp.js
- gulp-image
- gulp-sass


---



# Gulp 이슈 정리

Gulp 사용 실습을 따라하다 발생한 오류들을 해결했던 방법들을 정리 해놓으려한다.

## gulp-image 설치 이슈 (ENONET)

![](../../../../../assets/posts/Node-js-18/2020-12-28-00-24-40.png)

위 에러가 발생해 이틀동안 원인을 찾았다.

`gulp-image`는 이미지 파일을 압축하여 서버에 올려주는 작업을 해주는 라이브러리이다. [gulp-image npm 설치 페이지](https://www.npmjs.com/package/gulp-image)에서 다양한 옵션을 확인 할 수 있다. 설치 명령어가 다음과 같이 나타나있다.

![](../../../../../assets/posts/Node-js-18/2020-12-28-00-11-48.png)

여기서 사용중인 os에 맞게 External Dependencies를 먼저 설치하고 모듈을 설치해야 사용시 오류가 나지 않는다.
뒤늦게 관련 모듈을 설치했으나 해결되지 않았고, gulp-image 모듈 삭제 후 재설치하여 문제를 해결할 수 있었다.

## gulp-sass css path 이슈

`gulp-sass`는 scss를 css 파일로 변환시켜주는 라이브러리이다. scss를 읽어 생성된 css 파일은 지정 dest 경로에 정상적으로 생성되었는데 파일 경로를 제대로 읽어오지 못해 적용이 되지 않았다. 노마드코더 강의 내에서도 이슈를 연 사람이 두명있었는데 제대로된 해결책을 찾지 못했다.

[Stylesheet not loaded because of MIME-type](https://stackoverflow.com/questions/48248832/stylesheet-not-loaded-because-of-mime-type?page=1&tab=votes#tab-top)
여기서도 많은 사람들이 어려움을 겪고 있는 것을 볼 수 있다. 대충 보고 몇가지 따라해봤는데 나는 해결할 수 없었다.

찾아낸 해결책은 [Gulp-webserver : link to css doesn't work if outside the html folder?](https://stackoverflow.com/questions/36765750/gulp-webserver-link-to-css-doesnt-work-if-outside-the-html-folder) 이것이다.

보안상의 이슈로 같은 위치에 있는 파일만 읽어올 수 있다. 상위 또는 하위 폴더를 사용하고 싶은 경우 `gulp-webserver`가 지원하는 다른 미들웨어를 추가해 설정할 수 있다. 

```js
var serveStatic = require('serve-static');

gulp.task('webserver', function() {
    gulp.src(htmlFolder)
    .pipe(webserver({
        livereload: true,
        open: true,
        middleware: [serveStatic(__dirname + '/builds')]
    }));
});
```