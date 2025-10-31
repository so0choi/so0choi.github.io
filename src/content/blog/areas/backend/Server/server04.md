---
title: Flask앱 AWS로 배포하기
description: '도커를 사용해 간편하게 배포한다. 서버 세팅을 직접 하는 방법은 [’[FLASK] FLASK와 NGINX 클라우드 서비스 구동하기’](https://studyeong.blogspot.com/2020/02/flask flask nginx.html) 예전에 블로그에 정리해놓았다. 준비 사항 프로젝트 코드가 AWS 인스턴스…'
pubDate: 2020-09-08 00:03:58
tags:
  - Flask
  - uwsgi
  - AWS
category: Server

---


도커를 사용해 간편하게 배포한다. 서버 세팅을 직접 하는 방법은 ['[FLASK] FLASK와 NGINX 클라우드 서비스 구동하기'](https://studyeong.blogspot.com/2020/02/flask-flask-nginx.html) 예전에 블로그에 정리해놓았다.

## 준비 사항

프로젝트 코드가 AWS 인스턴스 서버 위에 모두 올라가있어야 한다. Git clone을 사용하거나 FTP를 사용하는 등의 방법이 있다.

깃 클론 방법은 아래와 같다.

```
git clone repository주소
```

## Docker 설치

[도커 공식 문서](https://docs.docker.com/engine/install/ubuntu/)에서 Ubuntu 환경에서 설치 방법을 알려주고 있다.

`apt` 패키지를 업데이트하고 `https`로 repository를 사용할 수 있도록 한다.

```
$ sudo apt-get update

$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

도커의 공식 GPG key를 추가한다.
아래 두번째 명령어를 입력했을 때 정상적으로 출력이 된다면 잘 추가 된 것이다.

```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
```

stable repository를 추가한다. 다른 버전으로 설치하고 싶다면 공식 문서를 참조한다.

```
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

도커 엔진을 설치한다.

```
 sudo apt-get update
 sudo apt-get install docker-ce docker-ce-cli containerd.io
```

_만약 특정 버젼의 도커를 설치해야 한다면 아래 명령어 처럼 버젼을 명시해주면 된다. 설치가능한 버젼은 다음과 같이 확인해 볼 수 있다._

```
# 설치 가능 버전 리스트
$ apt-cache madison docker-ce

# 특정 버전 설치
$ sudo apt-get install docker-ce=<VERSION_STRING> docker-ce-cli=<VERSION_STRING> containerd.io
```

`hello-world` 이미지를 실행하여 정상작동 되는지 확인한다.

```
sudo docker run hello-world
```

# Docker hub에서 필요한 이미지 사용하기

Docker hub에는 웬만큼 개발에 필요한 환경이 이미 세팅되어 이미지로 올라와있다. 더이상 개인이 하나하나 설치하고, 설정 파일을 수정하는 작업들이 필요 없다.

## Docker hub 로그인

`ubuntu` 계정으로 로그인 후 Docker Hub에 로그인 하려고 하면 permission denied 오류가 발생한다. docker.sok 파일의 권한 설정 때문인데,
dockergroup을 만들어 그룹에 도커 실행 권한을 주고 현재 사용자를 그룹에 추가하던가,
도커 실행 권한을 바꾸는 방법이 있다.
나는 파일 자체의 권한을 변경했다.

```
sudo chmod 666 /var/run/docker.sock
```

이제 도커 허브에 접속할 수 있다.

```
docker login
```

아이디와 패스워드를 입력하고 로그인에 성공하면 이제부터 도커 허브에 있는 모든 이미지들을 자유롭게 `pull` 해서 사용할 수 있다.

## Dockerfile 만들기

이번에 사한 `Flask` + `Nginx` + `uwsgi` 이미지는 [여기](https://github.com/tiangolo/uwsgi-nginx-flask-docker/issues)서 확인할 수 있다.
설정할 것도 별로 없고 정말 간편하다. 이전에 혼자 서버 세팅하다가 하루를 다 날려먹었던 것을 생각하면 정말 분하다..

### 폴더 구조

`uwsgi-nginx-flask-docker` 이미지를 사용하기 위해 `Dockerfile`을 만들어야 한다. 프로젝트 폴더의 구조는,

```
.
├── app
│   └── main.py
└── Dockerfile
```

이런 구조로 만들어야 한다. 파일 이름까지 모두 똑같이 설정한다.

### 도커파일

도커파일은 아래와 같다.
'Dockerfile'

```
FROM tiangolo/uwsgi-nginx-flask:python3.8
COPY ./app /app
```

간단히 설명하면 `FROM`은 base docker image를 선택하는 것이다. 내가 사용할 이미지를 명시해주고, 둘째 줄은 현재 폴더에 있는 `app` 폴더를 도커 컨테이너의 `app` 폴더에 복사한다는 뜻이다.

### 'main.py' 구조

`main.py`는 간단히 아래와 같은 모양을 하고 있으면 된다. Flask 객체의 이름은 무조건 `app`이어야 한다. 그리고 `port`를 지정하는 것을 명심하자.

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World from Flask"

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=80)
```

### 추가 설정

이제 기본 세팅은 모두 끝났다.
만약 프로젝트 파일이 외부 라이브러리를 설치하여 사용하고 있다면, `app` 디렉토리에 `requirements.txt` 파일을 추가하고 도커파일에 이를 설치하는 명령어를 하나 더 써줘야 한다.

디렉토리 구조

```
.
├── app
│   └── main.py
|   └── requirements.txt
└── Dockerfile
```

Dockerfile

```
FROM tiangolo/uwsgi-nginx-flask:python3.8
COPY ./app /app
RUN pip install -r requirements.txt
```

## 컨테이너 실행

이제 Dockerfile이 있는 위치에서 이미지를 빌드한다.

```
docker build -t image_name .
```

`t`는 tag의 약자이다. 뒤에 지정한 이름으로 이미지가 생성된다.

생성한 이미지로 컨테이너를 실행한다.

```
docker run -d --name container_name -p 80:80 image_name
```

지정한 컨테이너 이름으로 컨테이너가 생성된다.
`-p`는 포트를 설정하는 옵션이다. `main.py`에서 포트를 지정하지 않았거나, AWS 보안 그룹 설정에서 `80` 포트가 설정되어있지 않으면 연결에 오류가 발생한다.

여기까지 잘 세팅했다면 AWS의 ipv4 주소로 접속이 가능하다.

### 로그 확인

코드에 문제가 있어서 접속에 오류가 발생할 경우 로그를 확인해야 한다. 도커는 `logs` 명령어로 로그를 확인할 수 있다.

```
docker logs container_name
```

### shell script 만들기

코드에 문제가 생겨 파일을 수정해야 한다면 컨테이너를 지우고, 이미지를 지우고, 이미지를 다시 빌드하고, 컨테이너를 실행하고 ... 작업이 반복된다.
정말 귀찮은 작업이기 때문에 `shell script` 파일을 만들어서 사용해보자.

쉘 스크립트로는 다양한 작업들을 할 수 있다. 필요할 때 더 자세히 알아보면 좋겠다.

'test.sh'

```
docker rm -f pp-app
docker rmi -f pp-app
docker build -t pp-app .
docker run -d --name pp-app -p 80:80 pp-app:latest
```

그저 실행할 명령어를 차례대로 작성해주면 끝이다.
생성한 쉘스크립트 파일은 실행할 수 있는 파일로 권한을 변경해준다.

```
chmod +x test.sh
```

이제 `source` 명령어로 저 파일만 실행해주면 새로운 이미지로 컨테이너를 실행시킬 수 있다.

## Reference

[프로젝트 협업자 깃허브](https://github.com/zinirun/peepee-app)
