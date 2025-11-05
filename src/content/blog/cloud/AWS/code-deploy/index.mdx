---
title: Code Deploy 배포 자동화 이슈
description: '온프레미스 인스턴스에 작업 codedeploy agent config 파일이 없다는 이슈 명령어 사용시 config file이 같은 디렉토리에 생성된다. 명령어 사용시 위치에 파일을 만든다. SSL validation error 시도해본 방법들 certification 경로를 못 불러오는건 아닌가 하여 환경 변수 재설정'
pubDate: 2022-09-02 15:38:24
tags:

---


* 온프레미스 인스턴스에 작업

## codedeploy agent config 파일이 없다는 이슈

- `register` 명령어 사용시

config file이 같은 디렉토리에 생성된다.

```shell
aws deploy install --override-config --config-file ./codedeploy.onpremises.yml --region ap-northeast-2 --agent-installer s3://aws-codedeploy-ap-northeast-2/latest/codedeploy-agent.msi
```

- `register-on-premises-instance` 명령어 사용시

`/etc/codedeploy-agent/conf` 위치에 `conf.onpremises.yml` 파일을 만든다.

```shell
---
aws_access_key_id: secret-key-id
aws_secret_access_key: secret-access-key
iam_user_arn: iam-user-arn
region: supported-region
```

## SSL validation error

```shell
2022-09-02 15:36:05 INFO  [codedeploy-agent(23290)]: IMDSv2 http request failed, falling back to IMDSv1.
2022-09-02 15:36:05 INFO  [codedeploy-agent(23290)]: IMDSv2 http request failed, falling back to IMDSv1.
2022-09-02 15:36:05 INFO  [codedeploy-agent(23290)]: CodeDeploy endpoint: https://codedeploy-commands..
2022-09-02 15:36:06 INFO  [codedeploy-agent(23290)]: IMDSv2 http request failed, falling back to IMDSv1.
2022-09-02 15:36:06 INFO  [codedeploy-agent(23290)]: IMDSv2 http request failed, falling back to IMDSv1.
2022-09-02 15:36:06 INFO  [codedeploy-agent(23290)]: CodeDeploy endpoint: https://codedeploy-commands..
2022-09-02 15:36:06 ERROR [codedeploy-agent(23290)]: InstanceAgent::Plugins::CodeDeployPlugin::CodeDeployControl: Error during certificate verification on codedeploy endpoint https://codedeploy-commands..
2022-09-02 15:36:06 ERROR [codedeploy-agent(23290)]: Error validating the SSL configuration: Invalid server certificate
2022-09-02 15:36:06 ERROR [codedeploy-agent(23290)]: booting child: error during start or run: SystemExit - Stopping CodeDeploy agent due to SSL validation error. - /opt/codedeploy-agent/lib/instance_agent/plugins/codedeploy/command_poller.rb:65:in `abort'
```

### 시도해본 방법들

- certification 경로를 못 불러오는건 아닌가 하여 환경 변수 재설정
```shell
$ export AWS_CA_BUNDLE=/etc/ssl/certs
```

- 