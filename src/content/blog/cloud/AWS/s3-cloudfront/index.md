---
title: S3 & CloudFront 연동
description: 'AWS CloudFront 공식문서 CloudFront html, css, js 및 이미지 파일과 같은 정적 & 동적 웹 컨텐츠를 사용자에게 더 빨리 배포하도록 지원하는 AWS의 웹 서비스이다. 전세계의 엣지 로케이션을 통해 뛰어난 전송 능력을 가지고있다. 파일의 사본이 여러 위치에 보관되므로 안정성과 가용성도 향상된다…'
pubDate: 2020-10-15 22:27:37
category: cloud
tags:
  - AWS
  - S3
  - CloudFront




---


[AWS CloudFront 공식문서](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)

## CloudFront

html, css, js 및 이미지 파일과 같은 정적 & 동적 웹 컨텐츠를 사용자에게 더 빨리 배포하도록 지원하는 AWS의 웹 서비스이다.
전세계의 엣지 로케이션을 통해 뛰어난 전송 능력을 가지고있다. 파일의 사본이 여러 위치에 보관되므로 안정성과 가용성도 향상된다.

![](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/images/how-you-configure-cf.png)

CloudFront는 '배포'를 생성해 컨텐츠를 전송한다. 원본 파일을 가지고 있는 '오리진 서버'와 연동하여 사용한다.

## 구성하는 방법

1. **오리진 서버**를 지정한다.( Amazon S3 버킷 또는 고유 HTTP 서버) 오리진 서버는 객체(파일)의 원본 버전을 저장하고있다.

2. 웹 사이트나 애플리케이션을 통해 사용자가 파일을 요청할 경우 CloudFront에 어떤 오리진 서버에서 파일을 가져올지 알려주는 CloudFront 배포를 만든다.

3. CloudFront는 새 배포에 도메인 이름을 할당하고 이는 API 요청 등과 같은 request에 대항 response로 반환된다. (제공되는 URL을 사용해도 되고 설정을 통해 고유한 도메인 이름을 사용할 수도 있다)

4. CloudFront는 배포의 구성(!= 사용자의 컨텐츠)을 모든 `엣지 로케이션` 또는, CloudFront가 파일의 사본을 캐시하는 지리적으로 분산된 데이터 센터의 POP로 보낸다.

## 배포 시작하기

S3 버킷에 이미 파일 업로드와 퍼블릭 버킷으로 설정 완료했다고 가정

### 1단계 : CloudFront 배포 만들기

1. [https://console.aws.amazon.com/cloudfront/](https://console.aws.amazon.com/cloudfront/) 에서 CloudFront 콘솔을 연다.

2. [Create Distribution]을 선택하여 시작한다. Web 과 RTMP가 있는데 RTMP는 2020년을 마지막으로 지원이 종료된다. Web을 선택한다.

3. Origin Domain Name에서 이전에 생성한 S3 버킷을 선택한다. 나머지 Origin Setting과 Cache Behavior Setting, Distribution Setting 들은 그대로 둔다.

_기본 캐시 동작 설정_

- 배포를 위해 사용하는 CloudFront URL에서 사용하는 모든 요청은 지정된 S3 버킷에 전달된다.
- 이 때 쿠키와 쿼리 문자열 파라미터는 제외한다. S3는 쿼리를 처리하지 않으며 일부 쿼리 문자열 파라미터만 처리한다.
- 24시간 동안 엣지 로케이션에 객체 캐싱을 시도한다.
- 최종 사용자가 HTTP/HTTPS로 객체에 액세스 할 수 있도록 허용한다.
- 기본 요청 헤더만 오리진으로 전달하고, 헤더의 값에 따라 객체를 캐시하지는 않는다.

4. 설정을 마치고 배포를 생성하면 Domain Name이 나온다. 이제 이 도메인을 사용해 S3 컨텐츠에 접근할 수 있다.

### 2단계 : 링크 테스트

생성된 배포와 연결된 도메인 이름을 사용해 CloudFront에서 이 링크를 서비스하도록 만든다.

예를 들어 .html 파일에서 파일을 불러오는 경우 아래와 같이 작성한다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <img src="https://도메인이름/test.jpg" alt="penguin" width="500px" />
    <video
      src="https://도메인이름/test.mp4"
      autoplay
      height="500px"
      controls
    ></video>
  </body>
</html>
```

브라우저에서 컨텐츠가 정상적으로 출력된다면 잘 생성된 것이다.

## CloudFront 배포 생성시의 자세한 설정 사항들

생성한 S3를 Domain Name에 입력하면 대부분의 설정이 기본적으로 선택된다.

#### 기본 설정

- Origin Domain Name / Origin Path
- Restrict Bucket Access : `Yes` 선택시 기존 S3를 통한 컨텐츠로의 접근이 불가능해진다. 오직 CloudFront로만 접근 가능.
- 오리진 연결 시도 횟수, 제한 시간
- Origin custom header : 여기서 지정한 헤더가 모든 request에 포함된다.

#### 캐시 설정

- viewer 프로토콜 : 데이터 요청자가 어떤 프로토콜로 요청을 할 수 있는지에 대한 정책
- allowed HTTP method :
- lambda function associations : cloudFront 이벤트에 대한 lambda function arn을 지정할 수 있다. 이벤트 타입에는 'viewer request', 'response' 'origin request/response'가 있다.
- SSL Certificate
- 지원하는 HTTP 버젼
- IPv6 지원 여부
