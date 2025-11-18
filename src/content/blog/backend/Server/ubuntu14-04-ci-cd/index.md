---
title: Ubuntu14.04 CI/CD 구축
description: 'Codedeploy agent 설치 agent 파일을 설치한다. ruby 설치 후 agent를 설치한다. 이 때 ruby 버전 2 이상이 필요하므로 레포지토리를 따로 추가 후에 설치해야 정상 진행이 가능하다.'
pubDate: 2022-08-10 15:22:34
category: backend




---


## Codedeploy agent 설치

agent 파일을 설치한다.

```bash
wget https://aws-codedeploy-ap-northeast-2.s3.amazonaws.com/latest/install
chmod +x ./install
```

ruby 설치 후 agent를 설치한다. 이 때 ruby 버전 2 이상이 필요하므로 레포지토리를 따로 추가 후에 설치해야 정상 진행이 가능하다.

```bash
sudo apt-add-repository ppa:brightbox/ruby-ng
sudo apt-get update
sudo apt-get install ruby2.3 ruby2.3-dev
ruby -v # ruby 2.3.8p459 (2018-10-18 revision 65136) [x86_64-linux-gnu]
sudo service codedeploy-agent status # 설치 확인
```
