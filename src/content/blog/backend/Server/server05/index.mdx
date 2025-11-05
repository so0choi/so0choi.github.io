---
title: AWS ubuntu18.04 FTP 설치하기
description: '파일관리를 좀 더 편하게 하기위해 FTP를 설정했다. 인스턴스를 만들 때 마다 필요하기 때문에 설정방법을 알아두면 편하다. vsftpd 설치 vsftpd는 ubuntu의 기본 ftp 설치 패키지다. 패키지 관리자 을 업데이트 해주고 를 설치한다. 설치된 vsftpd를 재실행시키고 ubuntu가 실행될 때마다 함께 실행되…'
heroImage: './2020-09-09-00-24-11.png'
pubDate: 2020-09-08 23:22:50
tags:
  - FTP
  - AWS
  - ubuntu18.04


---



파일관리를 좀 더 편하게 하기위해 FTP를 설정했다. 인스턴스를 만들 때 마다 필요하기 때문에 설정방법을 알아두면 편하다.

## vsftpd 설치

vsftpd는 ubuntu의 기본 ftp 설치 패키지다.
패키지 관리자 `apt-get`을 업데이트 해주고 `vsftpd`를 설치한다.

```
sudo apt-get update
sudo apt-get install vsftpd
```

설치된 vsftpd를 재실행시키고 ubuntu가 실행될 때마다 함께 실행되도록 설정한다.

```
sudo systemctl restart vsftpd.service
sudo systemctl enable vsftpd.service
```

설치가 완료되면 vsftpd 설정 파일로 가서 몇가지 설정을 바꾼다.

```
sudo vim /etc/vsftpd.conf
```

- userlist_enable=YES
- userlist_file=/etc/vsftpd.userlist
- userlist_deny=NO

주석을 해제하면 됐었던 것 같은데 찾기 귀찮아서 그냥 맨 아래에 새로 써줬다.

`/etc/vsftpd.userlist` 파일을 생성하고 `ubuntu` 유저 이름을 추가한다.

'etc/vsftpd.userlist'

```
ubuntu
```

이제 `Filezilla`로 이동한다. `파일` > `사이트관리자` 에서 새로운 사이트를 생성한다.

![](./2020-09-09-00-24-11.png)

`SFTP` 프로토콜을 선택하고 호스트에는 AWS 인스턴스 IP를 넣는다. 프로토콜을 따로 선택하지 않아도 된다.
**로그온 유형**은 **키 파일**로 선택해 이전에 생성한 `ppk`또는 `pem` 파일을 불러오면 연결세팅은 끝이다.

`연결`을 눌렀을 때 잘 조회가 된다면 성공한 것이다.
