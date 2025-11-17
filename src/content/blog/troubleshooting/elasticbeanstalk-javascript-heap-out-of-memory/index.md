---
title: ElasticBeanstalk yarn 적용 및 Javascript heap out of memory 오류
description: 'ElasticBeanstalk에서 Node.js 엔진을 선택하면 default 패키지 매니저가 npm으로 설정된다. 대부분의 경우 npm이든 yarn이든 문제없이 실행되겠지만 내 프로젝트는 npm 실행시 에러가 발생했다. 관련 내용은 짧게 찾아봤는데 나중에 더 자세히 봐야겠다. 구글링을 하면 yarn을 설치하여 사용하는…'
heroImage: './2022-08-23-14-13-24.png'
pubDate: 2022-08-23 14:15:09
category: Error
tags:
  - nest.js
  - ElasticBeanstalk
  - Javascript heap out of memory
  - yarn





---






ElasticBeanstalk에서 Node.js 엔진을 선택하면 default 패키지 매니저가 npm으로 설정된다. 대부분의 경우 npm이든 yarn이든 문제없이 실행되겠지만 내 프로젝트는 npm 실행시 에러가 발생했다. 관련 내용은 짧게 찾아봤는데 나중에 더 자세히 봐야겠다.
구글링을 하면 yarn을 설치하여 사용하는 방법은 두 가지가 나오는데 Amazon Linux 이전 버전에서는 **prebuild state**에 접근하여 yarn을 설치해줬던 것으로 보인다. (`.ebextension/yarn.config` 파일 작성 )
하지만 이 방법은 Amazon Linux 2 machine 에서는 사용할 수 없고, `.platform/hooks/prebuild/`에 'yarn.sh'파일을 작성해줘야 한다.

## yarn.sh

```shell
#!/bin/bash
# need to install node first to be able to install yarn (as at prebuild no node is present yet)
#!/bin/bash
# need to install node first to be able to install yarn (as at prebuild no node is present yet)
sudo curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo yum -y install nodejs
# install yarn
sudo wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
sudo yum -y install yarn
# install
cd /var/app/staging/
# debugging..
ls -lah
yarn install
```

먼저 Node.js를 설치하고 yarn 설치를 진행하는 방식이다. 사용하는 노드 버전에 따라 설치 스크립트를 수정해서 사용해야한다.

## Procfile

그리고 root 디렉토리에 `Procfile` 파일을 생성해 ElasticBeanstalk에서 실행할 스크립트를 작성해야한다.

```
web: yarn run deploy:dev
```

다시 코드를 푸시하고..

## Javascript heap out of memory

잘 되는가 싶더니 또 에러가 발생했다.

![에러 사진](./2022-08-23-14-13-24.png)

`nest build` 명령어를 실행하는 과정에서 `Javascript heap out of memory` 에러가 발생했다.
왜 이런 시련이.... .


## 참고

- [Install With Yarn on AWS Elastic Beanstalk —Amazon Linux 2](https://aws.plainenglish.io/how-to-setup-yarn-on-amazon-linux-2-elastic-beanstalk-33c8d5cf5863)
- [[AWS Error] Codepipeline 배포 오류(JavaScript heap out of memory)](https://velog.io/@wngud4950/node-%EC%97%90%EB%9F%AC)