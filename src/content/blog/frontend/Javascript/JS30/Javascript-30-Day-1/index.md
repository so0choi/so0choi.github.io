---
title: Javascript 30 - Day 1
description: 'Javascript 30? Javascript30 위 링크에서 누구나 무료로 들을 수 있는 30여개의 자바스크립트 강의 동영상이다. 프로젝트를 몇가지 해봤지만 Node.js로 취업을 하기로 결심한 이상 자바스크립트를 좀 더 자유자재로 편하게 다룰 수 있어야 한다고 생각했다. 몇 달 전에 처음 발견하고, 학기가 끝나면 해…'
pubDate: 2020-08-15 22:18:06

category: frontend
tags:
  - Javascript30
  - Javascript





---


## Javascript 30?
[Javascript30](https://javascript30.com/)
위 링크에서 누구나 무료로 들을 수 있는 30여개의 자바스크립트 강의 동영상이다.
프로젝트를 몇가지 해봤지만 Node.js로 취업을 하기로 결심한 이상 자바스크립트를 좀 더 자유자재로 편하게 다룰 수 있어야 한다고 생각했다. 몇 달 전에 처음 발견하고, 학기가 끝나면 해봐야겠다고 생각했었는데 이제서야 하게 되었다.
이 강의는 이미 자바스크립트를 다룰 줄 아는 사용자가 수강한다고 가정하고 순수 바닐라 자바스크립트만을 이용해 작품을 하나씩 만들면서 실력을 쌓을 수 있는 강의다.
각 동영상의 길이가 그렇게 길지 않고 html, css가 이미 만들어진 기본 틀을 제공하고 있기 때문에 온전히 자바스크립트에만 집중할 수 있다는 점, 그리고 군더더기 없이 핵심만 이야기하는 강의였던 부분이 내가 느낀 장점이었다.
강의를 들으면서 새롭게 배운, 내가 몰랐던 내용들 위주로 정리해놓을 생각이다.

## Day1 - JavaScript Drum Kit
### HTML
- `<kbd>` : keyboard input을 정의하기 위해서 사용하는 html 태그
- `<audio>` : document에 sound를 더하기 위해서 사용하는 html 태그

### JS
- `element.classList` : element가 속한 class를 Array 형태로 반환한다
- `array.remove('element')` : array에서 element를 삭제한다
- `audio.play()` : `<audio>` element를 재생하는 메서드
- `keydown` : keyboard input event
```javascript
window.addEventListener('keydown',playSound);
```

- custom key value로 html element 구분하기
    ex) audio element, script 코드 내부에서 찾기
    ```html
    <audio data-key="76" src="sounds/tink.wav"></audio>
    ```
    
    위 element는 다음과 같은 js 코드로 선택할 수 있다.
    
    ```javascript
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    ```
    
