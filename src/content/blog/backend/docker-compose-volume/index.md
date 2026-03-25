---
title: "docker compose volume"
description: "컨테이너가 종료되어도 유지할 데이터 위치를 설정할 수 있다."
pubDate: 2026-03-25 15:48:10
category: backend
tags:
  - Docker

---

컨테이너 내부 데이터는 기본적으로 컨테이너를 종료하면 모두 유실된다. 컨테이너 생성 여부에 관계없이 유지되어야 하는 데이터들이 있을 것이다. 예를 들면 프로세스의 실행 로그가 그렇다. 로그를 계속해서 모니터링 해야하는데 컨테이너를 재시작하면 삭제되는 것은 곤란하다. docker-compose 파일의 volume을 사용해 이런 문제를 해결할 수 있다. 이를 컨테이너가 종료되어도 유지할 데이터 위치를 설정할 수 있다.

## 사용 방법

```dockerfile

services:
    nginx:
        container_name: nginx-proxy
        image: nginx:latest
        ports:
            - 80:80   
        volumes: 
            - ./nginx.docker.conf:/etc/nginx/nginx.conf:ro
            - nginx-logs:/data/logs/nginx
            
volumes:
    nginx-logs:
```

이런 식으로 작성하는데 `:`을 중심으로 왼쪽은 호스트 PC 위치를 나타내고 오른쪽은 컨테이너 내부 위치를 나타낸다. 
여러 컨테이너에서 모두 접근할 수 있는 위치를 만들려면 root 위치에 volume을 선언하면 되고 각 컨테이너 내부에서만 접근이 필요한 경우 services 내부에 작성하면 된다.

예시로 한 줄씩 살펴보면,

```
./nginx.docker.conf:/etc/nginx/nginx.conf:ro
```

현재 디렉토리에 위치한 nginx.docker.conf 파일을 컨테이너의 /etc/nginx/nginx.conf 위치로 마운트 하겠다는 것이다. 뒤에 붙은 `:ro`는 read-only를 뜻한다. 컨테이너가 함부로 파일을 수정하지 못하도록 권한을 제한하는 것이다. 당연히 `rw`(read-write)도 존재한다. rw는 기본값이므로 명시하지 않으면 rw가 설정된다. 


```
nginx-logs:/data/logs/nginx
```

이건 named volume이다. name volume은 도커가 관리하는 경로이다. 기본 위치는 `/var/lib/docker/volumes`로 정해져 있다. 기본 디렉토리명은 `프로젝트명_volume이름`으로 정해지는데 프로젝트명이 명시되지 않은 경우 docker-compose 파일이 위치한 디렉토리 이름이 들어간다. 
이렇게 실행한 경우 nginx 컨테이너 내부의 /data/logs/nginx 경로가 `/var/lib/docker/volumes/parent_nginx-logs/_data`로 올라간다. 

## bind mount vs named mount

| 구분 | bind mount | named volume |
|------|-----------|-------------|
| 위치 | 직접 지정 | docker가 관리 |
| 사용 목적 | 개발 | 운영 |
| 접근성 | 호스트에서 바로 수정 가능 | docker 통해서만 접근 |
| 예시 | ./logs:/app/logs | logs-volume:/app/logs |

bind mount는 위에 나온 named mount와 다른 유형 즉 위에서 봤던 현재 pc 파일을 컨테이너로 mount하는 형식의 volume을 뜻한다. bind mount는 docker container에 수정 사항을 바로 변경해야할때 사용되는 것으로 보통 개발 환경을 세팅할 때 사용한다. 컨테이너의 데이터를 영속적으로 보관하기 위해서는 named mount를 사용한다.

## 주의할 점

docker compose down을 사용해도 생성된 volume은 사라지지 않는다. 컨테이너만 사라지고 volume 데이터는 유지된다. volume도 함께 삭제하려면 `-v` 명령어를 사용해야 한다.

```shell
docker compose down -v
```

