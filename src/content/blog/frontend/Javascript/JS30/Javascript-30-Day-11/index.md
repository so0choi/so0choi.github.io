---
title: Javascript 30 - Day 11
description: 'Javascript30 Day11 Custom Video Player <br/ <link href="/images/test.css" rel="stylesheet" <div class="player" <video autoplay class="player video viewer" src="/images/652333414.m…'
pubDate: 2020-08-26 23:07:36
tags:
  - Javascript
  - Javascript30
category: frontend




---


# Javascript30 Day11 - Custom Video Player

<br/>
<link href="/images/test.css" rel="stylesheet">
<div class="player">
      <video autoplay class="player__video viewer" src="/images/652333414.mp4"></video>
      <div class="player__controls">
        <div class="progress">
          <div class="progress__filled"></div>
        </div>
        <button class="player__button toggle" title="Toggle Play">►</button>
        <input type="range" name="volume" class="player__slider" min="0" max="1" step="0.05" value="1">
        <input type="range" name="playbackRate" class="player__slider" min="0.5" max="2" step="0.1" value="1">
        <button data-skip="-10" class="player__button">« 10s</button>
        <button data-skip="25" class="player__button">25s »</button>
        <button class="player__button fullScreen"><img
            src="https://www.materialui.co/materialIcons/navigation/fullscreen_white_192x192.png"
            style="width: 30; height: 30px;"></button>
      </div>
    </div>

웹페이지에 일반적인 플레이어와 똑같이 동작하는 비디오 플레이어를 생성한다.
_마크다운 페이지에 소스를 붙여넣으려니 전체 동작이 실행되지는 않는다. 될때까지 계속해서 고쳐봐야겠다 .._

## 주요 기능

- 버튼 클릭시 영상 재생/일시정지 toggle 기능
- 비디오 view 화면 클릭 시 영상 재생/일시정지 toggle 기능
- skip 버튼 클릭시 해당 data-set 만큼 영상 skip
- `progress bar`로 재생 range 표시하기

## 사용한 DOM 객체

`<video>` - [Mozila 설명](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)

### 주 사용 메서드 & 속성

`video` 객체는 `image`와 비슷하게 `src`로 link를 줘 불러올 수 있다. 주로 사용한 속성은 `paused` 속성이다. 이 속성으로 비디오가 현재 재생중인지 정지상태인지를 알 수 있다.
영상을 재생하기 위해서는 `play()`, 그리고 정지시키기 위해서는 `pause()` 메서드를 사용한다. 또한 `currentTime` 속성은 현재 영상이 재생중인 위치를 `float` 형태로 반환하는데, 이 속성을 새로 지정하면 새로 setting 된 위치부터 영상을 재생하게 된다.

## 영상 재생 / 일시정지 기능 구현

영상이 재생되어있을 경우 정지를, 정지되어 있을 경우 재생시켜야 하기 때문에 `togglePlay()` 라는 함수를 생성한다.

```js
function togglePlay() {
  const method = video.paused ? "play" : "pause";
  video[method]();
}
```

함수를 호출하는 방식이 정말 신기했다. 이 문법을 모른다면 가독성이 떨어진다고 생각할 수도 있겠지만 방법만 안다면 코드를 더 깔끔하게 쓸 수 있는 좋은 방법이라고 생각한다.

영상이 재생 될 때, 재생 버튼을 일시정지 버튼으로 바꾸는데, 이 이벤트를 play() 내부에 넣을지 가 관건이었다. 나 혼자 개발했다면 `togglePlay()` 에 넣는 방법을 생각했을 것 같은데, 버튼 변경은 영상이 어떤 상황에서 또 재생되고 멈출 지 알 수 없는 모든 상황에서 변경되어야 하기 때문에 영상 자체의 `play`, `pause` 에 이벤트를 걸어 변경하는 방법으로 구현했다.

```js
function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  toggle.textContent = icon;
}
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
```

## 영상 스킵 기능

위에 설명한 것 처럼 영상을 스킵하는데는 `currentTime` 속성을 사용하면 된다.

```js
skipButtons.forEach((button) => button.addEventListener("click", skip));
function skip() {
  console.log(this);
  video.currentTime += parseFloat(this.dataset.skip);
}
```

여기서 내가 실수한 점은 이벤트 리스너에 함수를 인자로 넘길때 `()`를 붙인 것이다. 계속해서 실수하는데 찾아내기도 힘들기 때문에 항상 주의해야 할 부분인 것 같다.

## 볼륨과 재생 속도 조절

`video` 객체에는 여러 속성이 있다. console 창에서 PorotoType을 확인하면 좋을 것 같다. 그 중 볼륨을 조절하는 속성 `volume`과 재생 속도를 조절하는 `playBakcRate`가 있다.

```html
<input
  type="range"
  name="volume"
  class="player__slider"
  min="0"
  max="1"
  step="0.05"
  value="1"
/>
<input
  type="range"
  name="playbackRate"
  class="player__slider"
  min="0.5"
  max="2"
  step="0.1"
  value="1"
/>
```

```js
ranges.forEach((range) =>
  range.addEventListener("mousemove", handleRangeUpdate)
);

function handleRangeUpdate() {
  video[this.name] = this.value;
}
```

html 요소에 `name`을 줘서 정말 깔끔하고 간단하게 구현할 수 있었다.

## progress bar 구현

progress bar 구현 작업이 가장 까다로웠다. 사용되는 속성은 `video.duration()`이다. 비디오의 총 길이를 `float` 타입으로 반환한다. progress bar는 `flex-basis` 속성을 변경시킴으로써 화면상에 보여지는 range를 조절할 수 있다.

```html
<div class="progress">
  <div class="progress__filled"></div>
</div>
```

```css
.progress {
  flex: 10;
  position: relative;
  display: flex;
  flex-basis: 100%;
  height: 5px;
  transition: height 0.3s;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.progress__filled {
  background: #ffc600;
  flex: 0;
}
```

```js
function handleProgess() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}
```

`handleProgress()`는 progressBar를 이동함에 따라 보여지는 bar의 속성을 변경한다. `비디오의 현재 재생중인 시간 / 전체 미디어 재생 시간` 을 퍼센트화 하여 `flex-basis`값을 변경함으로써 구현한다.

`scrub()`는 마우스를 놓는 지점에 따라 영상이 재생되는 시간을 변경한다. `마우스 클릭 지점 / range bar의 전체 너비`에 미디어의 전체 재생 시간을 곱하면 어느 지점을 재생해야 하는지 값이 나올 것이다.

## 추가적 구현

### full screen 재생

강의에서는 다루지 않았지만 있으면 좋을 것 같아 개별적으로 기능을 더 추가해봤다. 먼저 full screen 버튼을 생성했다.

```html
<button class="player__button fullScreen">
  <img
    src="https://www.materialui.co/materialIcons/navigation/fullscreen_white_192x192.png"
    style="width: 30; height: 30px;"
  />
</button>
```

full screen 함수를 찾아봤는데 브라우저별로 다른 함수를 사용해야 했다. 아래와 같이 구현한다.

```js
function makeFullScreen() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    /* Firefox */
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    /* IE/Edge */
    video.msRequestFullscreen();
  }
}
```

### spacebar toggle play

아무래도 마우스 클릭보다는 spacebar를 이용한 재생이 더 편리하기 때문에 구현했다. `window` 이벤트로 등록해두었다.

```js
window.addEventListener("keydown", (e) => {
  if (e.keyCode === 32) {
    // spacebar
    togglePlay();
  }
});
```

<script src = "/images/test.js">

</script>
