---
title: Javascript 30 Day 16
description: 'Day 16 Mouse Move Shadow 마우스 이동에 따라 텍스트에 그림자 효과 주기 완성본 <style .hero { display: flex; justify content: center; align items: center; color: black; min height: 40vh; } </style <div c…'
pubDate: 2020-10-03 19:24:44
tags:
  - Javascript
  - Javascript30
category: Javascript

---


# Day 16 - Mouse Move Shadow

마우스 이동에 따라 텍스트에 그림자 효과 주기

## 완성본

<style>
    .hero {
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
        min-height: 40vh;
      }
</style>
<div class="hero">
    <h1 contenteditable>🔥WOAH!</h1>
</div>
<script>
const hero = document.querySelector('.hero');
      const text = hero.querySelector('h1');
      const walk = 100; //100px
      function shadow(e) {
        //destructuring
        const { offsetWidth: width, offsetHeight: height } = hero; // 화면 크기
        let { offsetX: x, offsetY: y } = e; //x, y는 마우스 위치
        if (this !== e.target) {
          x = x + e.target.offsetLeft;
          y = y + e.target.offsetTop;
        }
        const xWalk = Math.round((x / width * walk) - (walk / 2));
        const yWalk = Math.round((y / height * walk) - (walk / 2));
        text.style.textShadow = `${xWalk}px ${yWalk}px 0 rgba(255,0,255,0.7),
        ${xWalk * -1}px ${yWalk}px 0 rgba(0,255,255,0.7),
        ${yWalk}px ${xWalk * -1}px 0 rgba(0,255,0,0.7),
        ${yWalk * -1}px ${xWalk}px 0 rgba(0,0,255,0.7)`;
      }
      hero.addEventListener('mousemove', shadow);
</script>

## 소스 코드

그림자의 방향을 정하는데 사용되는 것은 mouseOffset과 브라우저의 크기이다. 텍스트의 컨테이너에 `mousemove` 이벤트를 등록하고 ES6 destructuring을 사용해 깔끔하게 값을 구해온다.

```js
//destructuring
const { offsetWidth: width, offsetHeight: height } = hero; // 화면 크기
let { offsetX: x, offsetY: y } = e; //x, y는 마우스 위치
if (this !== e.target) {
  x = x + e.target.offsetLeft;
  y = y + e.target.offsetTop;
}
```

여기서 `if`문이 사용되는 이유는 컨테이너위에 childe element가 있는 경우 offsetX, offsetY를 콘솔에 찍어보면 알수있지만 child element의 위치가 반환되기 때문이다. `this`는 항상 외부 컨테이너를 가리킬 것이다. 따라서 `Event.target`과 `this`가 다른 경우는 child element에 의해 이벤트가 호출된 것이라 반환된 offset에 child element와 컨테이너 사이의 왼쪽과 오른쪽 여백 만큼의 길이를 더해줘야 한다. (`let`을 쓴 이유)

offset을 구했다면 이제 그림자의 크기를 결정해야 한다.

```js
const walk = 100;
```

여기서 `100`으로 설정했다는 것은 `-50` 부터 `50` 까지의 pixel 길이로 그림자 위치를 조정한다는 뜻이다.

```js
const xWalk = Math.round((x / width) * walk - walk / 2);
const yWalk = Math.round((y / height) * walk - walk / 2);
text.style.textShadow = `${xWalk}px ${yWalk}px 0 rgba(255,0,255,0.7),
                        ${xWalk * -1}px ${yWalk}px 0 rgba(0,255,255,0.7),
                        ${yWalk}px ${xWalk * -1}px 0 rgba(0,255,0,0.7),
                        ${yWalk * -1}px ${xWalk}px 0 rgba(0,0,255,0.7)`;
```

`마우스 위치 / 화면 크기`에 그림자 크기를 곱하면 0부터 100 까지의 수가 나온다. 필요한 값은 -50에서 50 까지의 값이므로 `walk/2`를 빼준다. 여기서 구해진 값으로 텍스트의 그림자를 지정한다.

## 마무리

비율을 계산해 간단한 효과를 주는 기능을 잘 쓰면 정말 멋진 화면을 만들어 낼 수 있는 게 많은 것 같다. 간단 계산인데도 혼자 생각해내려고 하면 잘 안되고 결국 딱딱한 UI를 만들어내는 것 밖에 못하는 것 같다. :sweat_smile:
