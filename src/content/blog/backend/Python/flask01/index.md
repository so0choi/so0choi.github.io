---
title: Flask + Nginx로 클라우드에 서비스 배포하기
description: 'ubuntu 18.04 환경에서 Flask앱 Nginx로 서비스하기 먼저 NHN TOAST 서버에서 인스턴스를 생성하고 플로팅 아이피를 설정해놓은 상태에서 진행하였다. 수많은 구글링을 해봤지만 버전에따라 명령어나 패키지 이름이 달라지는 경우가 있어 설정이 쉽지 않았다. 드디어 설정을 완료하여 글을 쓴다. 프로젝트 개발시…'
pubDate: 2020-02-25 22:37:14
tags:
  - Flask
  - Python
category: backend




---


## ubuntu 18.04 환경에서 Flask앱 Nginx로 서비스하기

먼저 NHN TOAST 서버에서 인스턴스를 생성하고 플로팅 아이피를 설정해놓은 상태에서 진행하였다. 수많은 구글링을 해봤지만 버전에따라 명령어나 패키지 이름이 달라지는 경우가 있어 설정이 쉽지 않았다. 드디어 설정을 완료하여 글을 쓴다.
프로젝트 개발시 작성했던 글이기 때문에 진행 흐름에 따라 오류는 모두 기록해뒀다.

(2020년 2월 26일 기준)

### 설치 환경

- NHN Toast Instance
- ubuntu 18.04
- nginx 1.14.0
- python 3.6.9(OpenCV)

모든 작업은 작업을 위해 임시로 만든 폴더 `/home/ubuntu/myproject` 에서 진행한다.
연결을 위해 임시로 `test.py`파일을 생성했다.

```python
from flask import Flask
application = Flask(__name__)
@application.route("/")
def hello():
    return "<h1>hello!</h1>"
if __name__=="__main__":
    application.run(host='0.0.0.0')
```

## Nginx 설치

ubuntu 18.04 환경에서 설치는 아래 명령어로 진행한다.

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install nginx
```

설치 후 인스턴스의 `floating ip`로 접속하여 'Welcome to Nginx' 라는 Nginx 기본 페이지가 보인다면 설치가 잘 된 것이다.

## 서버 설정

그 다음 본격적으로 환경설정을 시작해보자.

```
cd /etc/nginx/sites-available
sudo touch myproject
vi myproject
```

생성된 `myproject` 파일에 아래와 같이 입력한다.

```
server {
    listen 80;
    server_name localhost; #instance에 등록해놓은 도메인 입력도 가능
    location / {
        include uwsgi_params;
        uwsgi_pass unix:/home/ubuntu/myproject/myproject.sock
    }
}
```

여기서 `uwsgi_pass` 의 의미는 뒤에 지정해준 경로의 소켓에 포워딩해준다는 의미로 이해하자. 다음으로 `sympoblic link`를 설정하여 사이트를 활성화 하고 기본 구성인 `default`파일은 삭제한 후 nginx를 restart해준다.

```
sudo ln -s /etc/nginx/sites-available/myproject /etc/nginx/sites-enabled
sudo rm /etc/nginx/sites-enabled/default
sudo service nginx restart
```

파일에 오타가 있을지도 모르니 꼭 nginx가 정상 구동되는지 중간중간 확인해준다.

```
sudo nginx -t
```

## 가상 환경 Virtualenv 설치

이제 패키지의 충돌을 방지하기 위해 가상환경을 만들어서 관리하도록하자. 마찬가지로 모든 작업은 `myproject` 디렉토리 내에서 진행했다.

```
apt install virtualenv
virtualenv -p python3 myenv
source myenv/bin/activate
```

서비스 할 flask 앱에 `requirements.txt`에 명시된 추가로 설치해야하는 패키지가 존재한다면, 당연하지만 가상환경이 활성화된 상태에서 진행해야 한다.

위 코드의 두번째 줄은 python3을 사용하는 가상환경 `myenv` 를 만드는 코드이고,
세번째 줄은 생성된 `myenv`가상환경으로 진입하는 것이다. 정상적으로 실행됐다면 커맨드의 맨 앞에 (myenv)가 추가되어야 한다.

### OpenCV 설치 오류

프로젝트 개발시 사용했던 OpenCV 패키지를 설치하려는데 오류가 발생했다.

```
python -m pip install opencv-python
```

정상적으로 설치가 완료되었다고 알림이 뜨는데도 불구하고 python을 실행시켜 import 하려고 하면 오류가 발생했다.
`('ImportError: libSM.so.6: cannot open shared object file')` 이 오류는 아래의 코드를 실행하면 해결 할 수 있다. 구글링에서 다른 해결법도 있었지만 나에게는 먹히지 않았고 더 찾아보다 아래 코드를 발견했다.

```
apt update && apt install -y libsm6 libxext6 libxrender-dev
```

다행히 오류를 해결했다.

## uwsgi 설치

만약 현재 환경에 `anaconda3`가 설치되어있다면 pip의 충돌로 인해 `uwsgi` 설치에 어려움을 겪을 수도 있다.
_나도 여러번의 시도 중에 anaconda를 이용하는 방법도 시도해보았지만 uwsgi 설치에서 번번이 애를 먹었다. 그래서 결국 anaconda를 사용하지 않기로 결정했다._ 😂

```
pip isntall uwsgi
```

설치가 완료되면 flask 앱을 5000번 포트로 띄워 정상 작동하는지 확인해보자

```
uwsgi --socket 0.0.0.0:5000 --protocol=http -w test:application
```

위 코드는 `test.py` 파일안에 있는 `application` 을 구동하겠다는 의미이다.
따라서 만약 구동하는 파일이 `run.py` 안의 `APP` 앱 이라면 `run:APP`으로 작성 해야한다.
floating ip의 5000번 포트로 접속시 정상작동 하는 것을 확인 할 수 있다.
위 작업을 좀 더 쉽게 하기 위해서 `.ini` 설정 파일을 만들어서 쉽게 구동할 수 있도록 하자.
`myproject.ini`파일을 생성한다.

```
[uwsgi]
module = test:application
master = true
processes = 5
virtualenv = /home/ubuntu/myproject/myenv
chdir = /home/ubuntu/myproject
socket = /home/ubuntu/myproject/myproject.sock
chmod-socket = 666
vacuum = true
daemonize = /home/ubuntu/myproject/uwsgi.log
die-on-term = true
```

설정파일을 작성 한 후 `myproject` 앱의 경로에서 아래의 명령어를 입력해주면 설정이 완료된다.

```
uwsgi --ini myproject.ini
```

## Reference

[Flak-aws-nginx](https://teddylee777.github.io/aws/flask-aws-nginx-%EC%84%A4%EC%A0%95%EB%B0%A9%EB%B2%95)
