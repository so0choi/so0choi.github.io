---
title: Data analytics2 - DataLake
description: 'DataLake Data lake는 정형화된 그리고 비정형화된 그 어떤 데이터도 모두 저장할 수 있는 중앙화된 집중식 레파지토리이다. 말 그대로 필터링이나 정제화가 진행되지 않은 데이터가 흐르는 강이다. 특징 데이터를 구조화 할 필요 없이, 있는 그대로 저장하여 데이터에 따라 서로 다른 분석 작업을 진행 할 수 있고,…'
pubDate: 2020-12-01 22:27:37
category: AWS
tags:
  - AWS
  - Data analytics

---


## DataLake

Data lake는 정형화된 그리고 비정형화된 그 어떤 데이터도 모두 저장할 수 있는 중앙화된 집중식 레파지토리이다. 말 그대로 필터링이나 정제화가 진행되지 않은 데이터가 흐르는 강이다.

### 특징

- 데이터를 구조화 할 필요 없이, 있는 그대로 저장하여 데이터에 따라 서로 다른 분석 작업을 진행 할 수 있고, 빅데이터 처리, 실시간 분석, 머신 러닝등 다양한 작업이 가능하다.

  ![](https://d1.awsstatic.com/Data%20Lake/320x320-what-is-a-data-lake.b32634fa96e91bb5670b885be9428a2c0c40c76d.png)

- 빅데이터 시대에 다양한 데이터를 통제하기 좋다.
- 기술의 복잡성을 이해하지 않은 상태로 데이터레이크 구축을 하게 되면 Data swamps(데이터 늪)이 될 수 있으므로 주의해야 한다.
- Data warehouse와 용도가 다르다. 서로를 보완할 수는 있지만 대체할 수는 없다.
- S3를 통해 시작된다.

### Data Warehouse와의 차이점

Data warehouse의 경우 관계형 데이터들을 빠르게 쿼리하기 위해 정형화된(clean한) 데이터를 저장하는 최적화된 데이터베이스이다. 반면, Data lake는 어떠한 형태의 데이터도 저장할 수 있고 저장하기전에 데이터를 구조화하는 과정이 필요없다.

큰 기업에서는 두 가지 서비스를 함께 사용하고는 한다. 이것을 **DMSA** (Data Management Solution for Analytics)라고 한다.

| Characteristics   | Data Warehouse                                                                              | Data Lake                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Data              | 트랜젝셔널한 시스템, DB, 어플리케이션 간에 관계형 데이터                                    | 비관계형, 관계형 데이터 모두 존재 (IoT 디바이스, 웹사이트, 모바일 앱, 소셜 미디어 등 다양)                               |
| Schema            | 데이터를 어떻게 사용할 지에 따라 스키마 설계 (schema-on-write)                              | 분석하는 시점에 스키마가 결정되어 데이터 작성됨 (schema-on-read : 데이터 사용 준비 상태가 될 때 까지 원시 상태로 보관됨) |
| Price/Performance | 더 비싼 비용으로 가장 빠른 쿼리 성능 보장                                                   | 저비용을 들이고도 쿼리 성능을 빠르게 할 수 있음                                                                          |
| Data Quality      | 정제된 데이터                                                                               | 어떠한 데이터도 넣을 수 있음 (raw data 또한)                                                                             |
| Users             | 사업 분석가                                                                                 | 데이터 분석가, 데이터 개발자, 사업 분석가                                                                                |
| Analytics         | Batch 동작 리포트, BI(Business Intelligence : 데이터 분석 결과에 기반한 사업 결정 ), 시각화 | 머신 러닝, 예측값 계산, 데이터 프로파일링 등 다양                                                                        |

### 비즈니스 모델

![](https://d2908q01vomqb2.cloudfront.net/b6692ea5df920cad691c20319a6fffd7a4a766b8/2017/10/23/s3-glue-data-lake-1.gif)

중간에 그려진 동그라미가 Data lake이다. S3를 기반으로 하는데 Raw data부터 정형화된 데이터까지 모두 중앙화되어 공통된 데이터 저장 공간이 만들어진다. Glue를 사용해 크롤링을 하는 작업도 Athena를 통한 분석 작업도 Redshift 서비스에서도 모두 하나의 Data lake에 접근하여 데이터를 사용하고 있다.

### 참고

- [AWS-What is a data lake](https://aws.amazon.com/ko/big-data/datalakes-and-analytics/what-is-a-data-lake/)
- [빅데이터 분석 환경의 핵심, 데이터레이크 구축하기](https://www.bespinglobal.com/bigdata-key-point-datalake-part-1/)
- [AWS 데이터 분석 특집 웨비나 후기](https://fi-lab.com/?r=Home&m=bbs&bid=COMM01&keyword=lfdwbkxslbsrsz&uid=3153&PHPSESSID=8eab6d728041ca6cad25e9046f2b7e65)

### 실습

![Build a data lake foundation with aws glue and amazon S3](https://aws.amazon.com/ko/blogs/korea/build-a-data-lake-foundation-with-aws-glue-and-amazon/)

AWS Glue 크롤러 생성시 만들었던 MovieLens 샘플 데이터를 그대로 사용하기로했다. Paraquet으로 csv 파일을 변환하고 Parquet 데이터에 대한 테이블 생성과 Athena를 사용한 쿼리를 해보았다.

## Elasticsearch Service

## QuickSight

## Data Pipeline
