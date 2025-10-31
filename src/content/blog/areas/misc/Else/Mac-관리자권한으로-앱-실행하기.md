---
title: Mac 관리자권한으로 앱 실행하기 (Eclipse)
description: 'MacOS에서 관리자권한으로 앱을 실행하는 방법은 Windows에 비해 까다롭다. 나의 경우 Eclipse 실행을 관리자권한으로 해야 했다. 시스템 자체에서 root 계정으로 로그인 후 사용하는 방법도 있으나 아래 방식은 한 가지 앱만 superuser 권한으로 실행하는 방법이다. Run an app with super…'
pubDate: 2023-12-04 09:17:16
category: Else

---


MacOS에서 관리자권한으로 앱을 실행하는 방법은 Windows에 비해 까다롭다. 나의 경우 Eclipse 실행을 관리자권한으로 해야 했다. 시스템 자체에서 root 계정으로 로그인 후 사용하는 방법도 있으나 아래 방식은 한 가지 앱만 superuser 권한으로 실행하는 방법이다.

## Run an app with superuser privileges just once

1. Finder에서 실행하고자하는 애플리케이션의 위치로 이동한다. (`Users/sychoi/eclipse/java-2023-06/Eclipse`)
2. 앱 아이콘에 우클릭 후 메뉴에서 '패키지 내용 보기'를 선택한다.
3. Contents 폴더 내부에서 MacOS 폴더를 찾아 들어간다.
4. 앱 실행 파일을 찾는다.
5. Terminal을 열고 **sudo**를 입력 후 앱 실행 파일을 Terminal에 끌어놓으면 파일 path가 자동으로 입력된다.
6. root 비밀번호를 입력하면 앱이 실행된다.

## 참고
- [How to run Outlook as Administrator on MacBook Air?](https://discussions.apple.com/thread/253727537)
