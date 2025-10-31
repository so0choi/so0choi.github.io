---
title: AWS Node.js SDK로 S3 사용해보기 & multer-S3
description: '설치 자격증명 global credential file을 통해 자격증명을 할 수도 있고 다양한 방법이 있다. 나는 간단하게 파일을 생성하여 사용했다. (IAM 사용자 생성 후 sdk 사용을 위한 키 밸류 값들은 받아놓은 상태) 파일은 다음과 같이 불러올 수 있다. S3 생성 및 리스팅 S3 접근 권한이 있는 계정이라면…'
pubDate: 2020-10-17 22:27:37
category: AWS
tags:
  - AWS
  - S3
  - multer
  - Node.js
  - AWS SDK

---


## 설치

```
npm i aws-sdk --save
```

```js
const AWS = require("aws-sdk");
```

## 자격증명

global credential file을 통해 자격증명을 할 수도 있고 다양한 방법이 있다. 나는 간단하게 `config.json`파일을 생성하여 사용했다.

(IAM 사용자 생성 후 sdk 사용을 위한 키-밸류 값들은 받아놓은 상태)

`config.json`

```js
{
  "accessKeyId": "",
  "secretAccessKey": "",
  "region": ""
}
```

파일은 다음과 같이 불러올 수 있다.

```js
AWS.config.loadFromPath("./config.json");
```

## S3 생성 및 리스팅

```js
//create S3 service object
s3 = new AWS.S3(); //{apiVersion: '2006-03-01'} 로 버전 명시도 가능

// call S3 to list the buckets
s3.listBuckets((err, data) => {
  if (err) console.log("ERROR,", err);
  console.log("SUCCESS", data.Buckets);
});
```

S3 접근 권한이 있는 계정이라면 해당 계정이 가지고있는 버킷들이 모두 출력 될 것이다.

## S3 특정 버킷의 Object 조회

```js
s3.listObjects({
    Bucket: "examplebucket", // 버킷의 이름
    MaxKeys: 2, // 응답받을 object key의 최대 개수
}, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
    /*
   data = {
    Contents: [
       {
      ETag: "\"70ee1738b6b21e2c8a43f3a5ab0eee71\"", 
      Key: "example1.jpg", 
      LastModified: <Date Representation>, 
      Owner: {
       DisplayName: "myname", 
       ID: "12345example25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc"
      }, 
      Size: 11, 
      StorageClass: "STANDARD"
     }, 
       {
      ETag: "\"9c8af9a76df052144598c115ef33e511\"", 
      Key: "example2.jpg", 
      LastModified: <Date Representation>, 
      Owner: {
       DisplayName: "myname", 
       ID: "12345example25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc"
      }, 
      Size: 713193, 
      StorageClass: "STANDARD"
     }
    ], 
    NextMarker: "eyJNYXJrZXIiOiBudWxsLCAiYm90b190cnVuY2F0ZV9hbW91bnQiOiAyfQ=="
   }
   */
})
```

### 그 외 옵션

- Delimiter(String) : key를 그룹짓기위한 문자열
- Encoding(String) : object key 값의 인코딩 형식을 지정할 수 있다. object key는 아무 Unicode 문자열을 포함할 수 있지만 XML 1.0 parser는 Unicode의 몇 문자열을 파싱할 수 없기 때문에 필요한 경우 인코딩 형식을 지정한다.
- Prefix(String) : 특정 prefix로 시작하는 key만을 가져온다.
- 

## S3 특정 버킷에 Object 업로드 (multer-S3)

```js
s3.putObject({
    Body: "<Binary String>",
    Bucket: "examplebucket",
    Key: "objectkey",
}, function(err, data) {
    if(err) console.log(err, err.stack);
    else console.log(data);
    /*
     data = {
      ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
      VersionId: "tpf3zF08nBplQK1XLOefGskR7mGDwcDk"
     }
 */
})
```

## 참고

- [AWS S3 Javascript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property)