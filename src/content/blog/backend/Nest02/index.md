---
title: NestJS Entity 파일과 dto의 동기화
description: 'Nest.js Entity 파일과 dto의 동기화 typeorm방식으로 Entity.ts 파일을 사용해 graphql 스키마와 DB Table 스키마를 동시에 만들어낼 수 있었다. 문제는 이에 접근하는 방식인 dto의 정의였는데, entity에 개체와 dto의 내용에 차이가 있다고해도 dto 스키마에 맞게 쿼리를 작성하…'
pubDate: 2021-05-13 02:09:39
tags:
  - NestJS
category: backend




---


# Nest.js Entity 파일과 dto의 동기화

typeorm방식으로 Entity.ts 파일을 사용해 graphql 스키마와 DB Table 스키마를 동시에 만들어낼 수 있었다. 문제는 이에 접근하는 방식인 dto의 정의였는데, entity에 개체와 dto의 내용에 차이가 있다고해도 dto 스키마에 맞게 쿼리를 작성하는 경우 graphql은 에러를 발생시키지 않는다. mutation을 실행시킨 후에야 서버 오류가 발생했다고 한다. 개체 하나를 추가할때마다 복사 붙여넣기로 두 파일의 동기화를 맞출 수 있겠지만 실수하게 될 가능성도 있고 그다지 좋은 방법으로 보이지 않는다. TypeORM은 Entity를 이용해 dto또한 생성할 수 있는 기능을 제공한다. 이런 기능들이 TypeORM을 강력하게 만들어주는것 같다.

## OmitType()

여러 종류의 dto 생성 방식이 있다. 그 중 OmitType을 이용했는데 OmitType은 첫번째 인자로 Entity 속성 중 dto에서 제외하고 싶은 속성의 이름들을 배열에 받아 나머지 속성들은 모두 포함한 dto를 생성시킨다. 두번째 인자로 받는 것은 만들어낼 dto의 데코레이터 설정이다. dto의 경우 InputType을 필요로 하는데 따로 데코레이터를 지정해주지 않는 이상 parent 클래스의 데코레이터를 상속받는다.

```js
@InputType()
export class CreateUserDto extends OmitType(UserInfo, ["id"], InputType) {}
```
