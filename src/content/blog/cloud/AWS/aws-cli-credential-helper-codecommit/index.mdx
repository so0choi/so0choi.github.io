---
title: AWS cli credential helper로 codecommit 인증하기
description: '이미 저장된 Codecommit credential이 있어서 다른 계정의 codecommit을 이용하려 할 때 credential helper 팝업이 뜨지 않아 이용이 불가능했다. 멀티 계정으로 codecommit을 이용하기 위해 AWS cli credential helper를 등록해 문제를 해결할 수 있었다. 사용 방…'
pubDate: 2024-03-29 10:40:54
tags: codecommit
category: AWS

---


이미 저장된 Codecommit credential이 있어서 다른 계정의 codecommit을 이용하려 할 때 credential helper 팝업이 뜨지 않아 이용이 불가능했다. 멀티 계정으로 codecommit을 이용하기 위해 AWS cli credential helper를 등록해 문제를 해결할 수 있었다.

## 사용 방법

1. Codecommit 권한이 있는 IAM 유저를 생성한다. (로컬 머신에 이미 계정 프로필이 등록돼있다면 스킵한다.)

2. 새로운 IAM 유저를 생성할 것 이라면 `AWSCodeCommitPowerUser` 정책을 추가하면 된다.

3. AWS cli가 설치되지 않았다면 설치를 먼저 진행한다. ([링크]( Getting Set Up with the AWS Command Line Interface))

4. AWS cli에 프로필을 등록한다. 터미널에서 아래 커맨드를 실행한다.
    ```
   aws configure
   ```
   그 이후 나타나는 프롬프트 메세지를 보고 설정값을 입력한다.
    ```
   AWS Access Key ID [None]: Type your IAM user AWS access key ID here, and then press Enter
    AWS Secret Access Key [None]: Type your IAM user AWS secret access key here, and then press Enter
    Default region name [None]: Type a supported region for CodeCommit here, and then press Enter
    Default output format [None]: Type json here, and then press Enter
   ```

5. aws credentials 파일을 확인한다. `~/.aws/credentials` 파일이다. 기존에 있던 계정을 사용한다면 여기서 프로필이름을 확인하고 아래 `gitconifg` 설정에 사용할 수 있다. 
   
6. `~/.gitconfig` 파일에 아래 내용을 추가한다.
    ```
    [credential]    
    helper = !aws --profile CodeCommitProfile codecommit credential-helper $@
    UseHttpPath = true
    ```

    profile을 설정하지 않으면 자동으로 default 프로필이 설정된다.

7.  git 커맨드를 실행해서 문제 없으면 설정이 잘된 것 이다.

## 참고

- [AWS Document](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-https-unixes.html)
- [Stackoverflow - git multiple credential helper](https://stackoverflow.com/questions/53189190/git-multiple-credential-helper)s
