---
title: svg 파일 크기 변경
description: '로고 이미지로 svg 파일을 받아서 앱 아이콘 사이즈에 맞게 파일 변환이 필요했다. 이미지 비율은 유지하면서 로고가 중앙에 오도록 하여 전체 이미지 크기는 정사각형으로 고정이 필요했다. svg를 png로 변환해주는 사이트들이 많은데 그냥 프로그램을 설치하는게 제일 깔끔한 방법인 것 같다. 😌 rsvg convert 먼…'
pubDate: 2023-04-04 10:42:36
category: Else

---


로고 이미지로 svg 파일을 받아서 앱 아이콘 사이즈에 맞게 파일 변환이 필요했다. 이미지 비율은 유지하면서 로고가 중앙에 오도록 하여 전체 이미지 크기는 정사각형으로 고정이 필요했다. svg를 png로 변환해주는 사이트들이 많은데 그냥 프로그램을 설치하는게 제일 깔끔한 방법인 것 같다. 😌

## rsvg-convert

먼저 원하는 width와 height를 가진 png 파일로 변환한다. `librsvg`를 설치했다. ubuntu에서는 `rsvg-convert`로 사용가능하다.

```shell
brew install librsvg
```

설치 후 아래 명령어를 입력한다.

```shell
librsvg -a -w 1024 -h 1024 logo.svg > logo-libsrvg.png
```

## imagemagick

이미지와 관련된 다양한 기능을 제공하는 소프트웨어이다.

```shell
brew install imagemagick
```

아래 명령어를 입력하면 된다.

```shell
magick -background none -resize 1024x1024 -gravity center -extent 1024x1024 logo-rsvg.png logo-magick.png
```


## 참고

- [How to convert svg while keeping aspect ratio but changing extents](https://stackoverflow.com/questions/34998213/how-to-convert-svg-to-png-while-keeping-aspect-ratio-but-changing-extents)
