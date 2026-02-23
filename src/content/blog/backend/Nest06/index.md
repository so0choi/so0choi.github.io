---
title: TypeORM
description: 'TypeORM TypeORM 은 다양한 플랫폼에서 TypeScript와 JS로 실행되는 ORM이다. ORM이란 ’Object Relational Mapping’의 줄임말이다. 최신 JS를 지원하고 DB로의 작업을 효율적으로 수행할 수 있도록 도와준다. Entity Entity는 DB에 저장되는 데이터의 형태를 보여주는…'
pubDate: 2021-08-30 23:21:38
tags:
  - NestJS
  - TypeORM
category: backend





---



**TypeORM**은 다양한 플랫폼에서 TypeScript와 JS로 실행되는 ORM이다. ORM이란 'Object Relational Mapping'의 줄임말이다. 최신 JS를 지원하고 DB로의 작업을 효율적으로 수행할 수 있도록 도와준다.

## Entity

Entity는 DB에 저장되는 데이터의 형태를 보여주는 Model로, DB에 테이블을 매핑해주는 class이다. `@Entity()` 데코레이터로 정의한다.

```js
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isActive: boolean;
}
```

- @PrimaryGeneratedColumn() : 기본키
- @Column() : 속성

각 Entity는 반드시 하나의 primary column을 가져야한다.

또한, 모든 Entity들이 typeORM의 connection option에 정의되어있어야 한다.

```js
import { createConnection, Connection } from "typeorm";
import { User } from "./entity/User";

const connection: Connection = await createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
  entities: [User],
});
```
