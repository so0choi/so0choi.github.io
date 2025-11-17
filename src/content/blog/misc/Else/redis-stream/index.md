---
title: Redis Stream 알아보기
description: 'Redis stream은 append only 로그와 비슷하게 동작하는 데이터 구조다. O(1)의 랜덤 액세스가 가능하며 컨슈머 그룹이라는 고성능 기능도 탑재되어있다. redis stream을 이용하면 기록과 동시에 실시간으로 이벤트를 소비할 수 있다. 사용 가능한 예시는 다음과 같다. 이벤트 소싱 (유저 액션 트래킹)…'
pubDate: 2025-09-09 04:29:18
category: Else
tags:
  - Redis

---


Redis stream은 append only 로그와 비슷하게 동작하는 데이터 구조다. O(1)의 랜덤 액세스가 가능하며 컨슈머 그룹이라는 고성능 기능도 탑재되어있다. redis stream을 이용하면 기록과 동시에 실시간으로 이벤트를 소비할 수 있다.
사용 가능한 예시는 다음과 같다.

- 이벤트 소싱 (유저 액션 트래킹)
- 센서 모니터링 (디바이스 연속 측정 데이터)
- 알림 (유저별 알림 스트림)

각 스트림 엔트리는 고유 ID를 가지며 이 ID 값을 가지고 나중에 값을 불러오는 것이 가능하다.

## 기본 명령어

- XADD : 스트림에 새로운 엔트리를 추가한다.
```
XADD key <*|id> field value [field value...]
```
`*` 은 자동생성 아이디를 쓰겠다는 뜻이다. 

- XREAD : 한 개 이상의 엔트리를 읽는다.
```
XREAD [COUNT count] [BLOCK milliseconds] STREAMS key [key...] id [id...]
```
`BLOCK` 옵션을 사용하지 않으면 synchronous하게 동작한다. 가장 최근에 추가된 엔트리부터 반환한다. `XRANGE`와의 차이첢은 다수의 스트림을 동시에 읽을 수 있다는 점이다.  

- XRANGE : 두 개 ID 사이의 엔트리들을 반환한다.
```
XRANGE key start end [COUNT count]
```
`start`와 `end` 값으로 +와 -를 쓸 수 있다. COUNT 값 만큼을 반환한다. 

- XLEN : 스트림 길이를 반환한다.
- XDEL : 스트림에서 엔트리를 제거한다.
- XTRIM : 오래된 엔트리를 제거한다. 

## 사용 예

체크포인트를 지나가는 카레이서의 기록을 레이서의 기본 인적 사항과 함께 저장한다.

```ssh
> XADD race:france * rider Castilla speed 30.2 position 1 location_id 1
"1692632086370-0"
> XADD race:france * rider Norem speed 28.8 position 3 location_id 1
"1692632094485-0"
> XADD race:france * rider Prickett speed 29.7 position 2 location_id 1
"1692632102976-0"
```

두 개 범위 사이의 값들을 읽는다. `1692632086370-0`와 최대값 사이의 두 개의 엔트리를 반환하는 코드이다.

```ssh
> XRANGE race:france 1692632086370-0 + COUNT 2
1) 1) "1692632086370-0"
   2) 1) "rider"
      2) "Castilla"
      3) "speed"
      4) "30.2"
      5) "position"
      6) "1"
      7) "location_id"
      8) "1"
2) 1) "1692632094485-0"
   2) 1) "rider"
      2) "Norem"
      3) "speed"
      4) "28.8"
      5) "position"
      6) "3"
      7) "location_id"
      8) "1"
```

스트림의 끝에서부터 100개의 새 스트림을 읽는데 새롭게 작성되는 스트림이 없다면 300ms까지 block 시킨다. 

```
> XREAD COUNT 100 BLOCK 300 STREAMS race:france $
(nil)
```

## Stream 기초

- Entry ID
엔트리 id는 XADD 커맨드 결과값으로 확인할 수 있다. 두 개의 파트로 구성되어있다.
```
<millisecondsTime>-<sequenceNumber>
```
앞 쪽의 밀리초 부분은 Redis의 로컬 타임이다. 같은 밀리초에 이벤트가 발생한 경우 뒤의 sequence 부분이 둘의 구분자로 사용된다. 와일드카드를 쓰지 않고 아이디를 명시할 수도 있지만 이전 아이디보다 작은 값으로는 아이디를 설정할 수 없다.

