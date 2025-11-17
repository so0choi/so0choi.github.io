---
title: TypeORM Query builder로 Join
description: 'TypeORM에서 서로 다른 테이블을 조인하여 값을 가져오는 작업은 Query Builder를 사용해야 한다. SQL query TypeORM'
pubDate: 2022-07-07 11:06:41
tags:
  - NestJS
  - TypeORM

---


TypeORM에서 서로 다른 테이블을 조인하여 값을 가져오는 작업은 Query Builder를 사용해야 한다.

## SQL query

```sql
select tb1.a, tb2.b, tb3.c from tb1, tb2, tb3 where tb1.a = tb2.a and tb2.b = tb3.b and tb1.c = "test"
```

## TypeORM

```js
const query = await this.tb1Repository
  .createQueryBuilder("tb1")
  .addSelect("tb2.b", "tb2_b")
  .addSelect("tb3.c", "tb3_c")
  .innerJoin("table2", "tb2", "tb1.a = tb2.a")
  .innerJoin("table3", "tb3", "tb2.b = tb3.b")
  .where("tb1.c = :test", {
    test: "test",
  })
  .getRawOne();
```
