---
title: "DRM 알아보기"
description: "hls, drm, cmaf 정리하기"
pubDate: 2026-02-26 17:25:25
category: misc
heroImage: "./img.png"

---


DRM(Digital Rights Management)은 보호되는 컨텐츠에 접근 제한을 걸어 인증되지 않은 사용자의 접근을 제한하는 기술이다. DRM 기술을 사용하는 가장 큰 목적은 인증되지 않은 사용자가 디지털 컨텐츠를 무단으로 복제하거나 수정하는 것을 막는 것이다.

DRM 소프트웨어 솔루션은 주로 세 가지 기능을 제공한다.
- Encryption: 컨텐츠를 암호화하여 인증되지 않은 사용자는 컨텐츠를 이용하지 못하도록 한다.
- Licensing: key나 license를 사용해 인증된 사용자인지 검증하여 컨텐츠 접근을 허용하거나 거부한다.
- Authentication: 컨텐츠 접근자의 신원을 확인한다.


## 영상에서 사용되는 DRM 시스템

주요 DRM 시스템은 세 가지가 있다. 각 시스템이 지원하는 플랫폼과 영상 프로토콜이 달라 DRM 제공자라면 모든 시스템을 구현해야 한다.

| DRM | 플랫폼              | 스트리밍 프로토콜         |
|--- |------------------|-------------------|
|Google Widevine | Chrome / Android | DASH / CMAF |
| Apple FairPlay | Safari / iOS| HLS               |
|Microsoft PlayReady | Edge / Windows| DASH              |


## 영상 스트리밍에서 DRM 재생 원리

![img.png](img.png)
*https://optiview.dolby.com/resources/blog/streaming/what-is-drm-understanding-digital-rights-management/*

영상의 경우 사전에 영상 파일을 암호화 해두고 CDN에 올려둔 뒤 재생하는 순간에 요청자가 재생 권한을 가지고 있는지 DRM 라이선스 서버에서 확인해 플레이어 안의 CDM(Consent Decryption Module)이 복호화 키를 받아 재생하는 구조이다.

### 재생 흐름

재생 흐름을 간단하게 나타내면 아래와 같다.

```shell
Player
   │
   │ manifest.m3u8      # 1. 플레이어가 manifest 요청
   ▼
CDN
   │
   │ encrypted segment  # 2. manifest 안에 DRM 정보 포함 
   ▼
Player
   │
   │ license request   # 3. 플레이어가 license 서버 요청
   ▼
License Server         # 4. license 서버에서 권한 확인 
   │
   │ decryption key    
   ▼
CDM                    # 5. CDM이 key 받아 복호화
   │
   ▼
Playback               # 6. 영상 재생
```

웹 플레이어 sdk들은 drm 활성화를 위한 속성값이 존재하며 올바른 값을 설정하면 player 내부 코드가 자동으로 라이센스 서버로 요청을 보내 복호화 까지 자동으로 이루어진다.

#### CDM
CDM은 Content Decryption Module의 약자로 DRM에서 복호화 기능을 담당하는 모듈을 말한다. 이 모듈을 사용해 HTML5 비디오가 무거운 미디어 플러그인 없이도 DRM 래핑 컨텐츠를 재생할 수 있게 된다.

## HLS와 DRM

### HLS
Apple이 개발한 HTTP 기반의 적응형 미디어 스트리밍 프로토콜이다. 영상을 작은 조각, 세그먼트로 나눠 웹 서버를 통해 전송하고 클라이언트의 네트워크 상태에 따라 화질을 자동 조절하여 안정적인 영상 시청을 지원하는 기술이다.

HLS - DRM 사용에서는 manifest에서 `EXT-X-KEY`로 DRM 옵션을 명시한다. 다음은 multi drm이 적용된 vod 영상을 safari에서 재생했을 때 network 탭에서 캡쳐한 HLS m3u8 파일의 요청 내용이다.

```
#EXTM3U
#EXT-X-VERSION:5
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-KEY:METHOD=SAMPLE-AES,URI="skd://<content-id>",KEYFORMAT="com.apple.streamingkeydelivery",KEYFORMATVERSIONS="1"
...
```
옵션을 하나씩 뜯어보면,
- METHOD: 암호화 방식이다. `SAMPLE-AES`, `AES-128` 등이 있다.
- URI: DRM 라이센스를 얻기 위한 uri
- KEYFORMAT: DRM 시스템 식별자이다. 나는 Safari에서 재생했기 때문에 `apple`이 보인다. `com.apple.streamingkeydelivery`는 FairPlay DRM을 의미한다.
- KEYFORMATVERSIONS: DRM 포맷 버전

> AES-128 vs SAMPLE-AES
> AES-128은 전체 segment를 암호화하는 방식이고, SAMPLE-AES는 media sample 단위 암호화이다. 보통 DRM-HLS 에서는 SAMPLE-AES를 사용한다.


## Widevine DRM 보안 레벨
Widevine은 디바이스 보안 수준에 따라 3가지의 보안 레벨을 정의하고 있다.

| Level | 설명               | 필요사항 |
| ----- | ---------------- | --- |
| L1    | hardware secure  | 재생에 관련된 모든 처리가 보안이 적용된 환경에서 실행되어야 한다.|
| L2    | partial hardware | 복호화는 TEE에서 이루어지지만, 스트림 출력 자체는 다른 영역에서 처리된다.|
| L3    | software only    | 신뢰할 수 없는 영역에서 복호화와 동영상 처리가 이루어진다. 소프트웨어 방식으로 DRM을 처리해 컨텐츠 보호에 취약하다.|

L3를 사용하는 경우 넷플릭스 영상 화질이 최대 480p로 제한되기도 하며 HD, FHD, 4K 영상은 L1에서만 재생되도록 한다. 이 개념은 안드로이드의 디바이스 파편화 문제 때문에 만들어졌다. 기기마다 보안 구성이 달라 신뢰할 수 있는 환경에서 컨텐츠가 재생되도록 일원화 하기 위해 나온 개념이다. FairPlay와 PlayReady는 이 개념이 없다. Apple은 모든 디바이스가 동일한 보안 아키텍처를 가지고 있어 이 개념이 필요 없고, PlayReady는 Security Level(SL) 개념을 사용하기는 하지만 Widevine의 L1, L2, L3 개념과 직접 대응되지는 않는다. 

## CMAF와 DRM
CMAF는 Common Media Application Format이다. 위에서 살펴봤던 서로 다른 DRM 시스템을 모두 지원해야 했던 multi drm과 상반되는 DRM 제공 방식으로 콘텐츠 이중화 문제를 해결하기 위해 등장한 표준 포맷이다. CMAF는 하나의 콘텐츠 파일로 여러 플랫폼을 지원할 수 있게 설계되었다는 것이 차이점이다.

CMAF DRM은 
1. 스트리밍에 최적화된 fMP4(fragmented MP4)
2. AES-CBC 방식의 암호화
이 두 가지 기술이 자리하고 있다. 

기술이 처음 등장했을 때는 지원되지 않는 구형 기기에 호환성 문제로 인해 도입이 어려웠으나 현재 대부분의 운영체제에서 호환성 문제가 해결되어 현실적인 선택지가 되었다. 
그렇다고 하더라도 구형 디바이스 이용 고객까지 문제 없이 지원해야 한다면 좀 더 면밀한 검토 후에 도입을 고려해야 할 새로운 기술이다.

## DRM의 한계

DRM을 쓴다고 완벽하게 컨텐츠 보호를 할 수 있는 것은 아니다. 이 기술에도 한계가 존재한다. 접근을 제한할 수는 있지만 완벽한 복제 방지는 어려운 일이다. 사용자가 녹화 프로그램을 사용하는 경우 이를 막을 수는 없다. 국내에는 아직도 녹화 프로그램 방지를 더 선호하는 업체들이 많다. 하지만 녹화 프로그램을 이름을 사용해 방지해봤자 이름만 조금 바꿔서 실행하면 감지하지 못하는 문제가 있어 무용지물이다. DRM을 사용하면 적어도 복제 비용을 높이고 불법 유통을 어렵게 만들수 있다.
또한 플랫폼별로 다른 DRM을 요구하는 특성 때문에 multi DRM 구성이 필요하고, 이는 컨텐츠 다중 패키징과 라이센스 서버 구성의 복잡도를 증가시키는 문제도 있다. 
DRM 설정이 잘못된 경우 일부 기기에서 재생이 안된다거나 특정 브라우저에서 호환성 문제가 생긴다거나 보안 레벨에 따른 화질 제한 등의 문제가 발생해 사용자 경험을 저하시킬 수도 있다. 


## 참고
- [CMAF란 무엇인가 멀티 DRM 운영을 단일화하는 방법](https://doverunner.com/kr/blogs/multi-drm-cmaf-single-content/)
- 
