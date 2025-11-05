---
title: Javascript 30 - Day 8
description: 'Javascript30 Day8 Fun with HTML5 Canvas W3C 튜토리얼 HTML element는 웹 페이지에서 그래픽을 그리기 위해 사용하는 요소이다. 아래 캔버스에서 테스트 해볼 수 있다! (우클릭으로 캔버스 비우기) <canvas id="draw" width="700" height="300" styl…'
pubDate: 2020-08-20 23:55:29
tags:
  - Javascript
  - Javascript30
category: Javascript

---

# Javascript30 Day8 - Fun with HTML5 Canvas
[W3C 튜토리얼](https://www.w3schools.com/graphics/canvas_intro.asp)
HTML `<canvas>` element는 웹 페이지에서 그래픽을 그리기 위해 사용하는 요소이다.
*아래 캔버스에서 테스트 해볼 수 있다! (우클릭으로 캔버스 비우기)*

<canvas id="draw" width="700" height="300" style="border:2px solid #A2CEDE"></canvas>
<script>
    const body = document.querySelector('body');
    body.addEventListener("contextmenu", ( e )=> { e.preventDefault(); return false; } );
    const canvas = document.querySelector("#draw");
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#BADA55";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 30;
//      ctx.globalCompositeOperation = "multiply";
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;
      let hue = 0;
      let direction = true;
      function draw(e) {
        if (!isDrawing) return;
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
        hue++;
        if (hue >= 360) hue = 0;
        if (ctx.lineWidth >= 100 || ctx.lineWidth <= 10) {
          direction = !direction;
        }
        if (direction) ctx.lineWidth++;
        else ctx.lineWidth--;
      }
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mousedown", (e) => {
        if (e.which === 1) {
          isDrawing = true;
          [lastX, lastY] = [e.offsetX, e.offsetY];
        } else if (e.which === 3) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
      canvas.addEventListener("mouseup", () => (isDrawing = false));
      canvas.addEventListener("mouseout", () => (isDrawing = false));
</script>

자세한 사용법은 tutorial을 참고하는게 좋을 것 같다.
블로그에는 기본 사용법만을 간단하게 정리해놓을 생각이다.

## 기본 사용법
- 선언
```html
<canvas id="draw" height="200" width="500"></canvas>
```
canvas는 html 요소이다. 다른 element와 같은 방식으로 선언하면 된다.

- 요소에 접근
canvas element로의 접근은 오직 `context`로만 할 수 있다. `2d`, `3d`가 있고 오늘은 2d 그림판을 구현했기 때문에 `2d`를 사용했다.
```js
const canvas = document.querySelector("#draw");
const ctx = canvas.getContext("2d");
```

- 속성
`context`의 속성을 변경하면된다. 다양한 속성이 존재한다. 선의 마무리를 어떻게 할 지, 다른 점과 만났을 때 어떻게 처리할 지, 선의 두께, 색깔 등 여러가지가 있다.

- 선 그리기
선 이외에도 원, 직사각형, 텍스트 등 다양한 요소를 그릴 수 있다. 오늘은 마우스의 이동에 따른 선을 그리기 위해 선을 그리는 방법을 정리한다.
```js
ctx.beginPath();
ctx.moveTo(lastX, lastY);
ctx.lineTo(e.offsetX, e.offsetY);
ctx.stroke();
```
선을 그리기 위해서 `beginPath()`를 호출한다. `moveTo()`는 선의 시작점, `lineTo()`는 선의 마지막 지점을 의미한다. `stroke()`가 호출되지 않으면 선이 그려지지 않는다. 
`e.offset`은 마우스 이동에 따라 EventListener를 걸어 놓은 이벤트 객체를 의미한다. 이벤트 객체는 마우스 위치를 반환하고, `draw` 함수에서 이를 사용한다.

- HSL 를 이용한 색 변경
색깔을 계속해서 변화시키기 위해 HSL을 사용했다.
HSL은, Hue, Saturation, Lightness를 말한다. 색을 나타내는 표현 방식중 하나다. [HSL Picker](https://hslpicker.com/) 여기서 시험해볼 수 있다.
```js
let hue = 0;
function draw(e) {
    //blah blah...
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    hue++;
    if (hue>=360) hue = 0;
}
```
이렇게 S와 L은 고정시키고 Hue에 변화를 주면 색깔만 바뀌게 된다. 

- 캔버스 초기화
강의에는 나오지 않았지만 블로그에 캔버스를 추가하면서 초기화 기능이 있으면 좋겠다는 생각을 해 찾아보았다.
`canvas` element 자체에 기능은 있었고, 우클릭시에 발현하도록 하고 싶었기 때문에 우클릭 메뉴가 나오지 않도록 했다.
```js
div.addEventListener("contextmenu", ( e )=> { e.preventDefault(); return false; } );
```
또한 마우스 이벤트에 좌클릭 / 우클릭을 구분하는 부분을 추가해 clear 이벤트를 추가했다.
```js
canvas.addEventListener("mousedown", (e) => {
        if (e.which === 1) {
          isDrawing = true;
          [lastX, lastY] = [e.offsetX, e.offsetY];
        } else if (e.which === 3) {
    // canvas 지우는 부분
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
```

웹페이지에 적절히 활용해 화이트 보드 기능을 넣으면 재미있을 것 같다. :sparkles: