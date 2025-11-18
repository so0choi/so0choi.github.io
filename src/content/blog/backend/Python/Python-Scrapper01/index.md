---
title: Python web scrapping (Beautiful Soup)
description: 'Web Scrappping 이란 웹페이지에서 데이터를 수집하는 모든 과정을 말한다. 크롤링과 혼용되어 사용되는 일이 많은데, 크롤링은 웹 페이지들을 수집, 분류하여 나중에 쉽게 찾아 볼 수 있도록 인덱싱 하는 작업이다. 따라서 스크래핑이 더 큰 범주에 속한다고 보면 된다. 파이썬에는 웹 스크래핑을 도와주는 다양한 모듈들…'
pubDate: 2020-08-29 02:28:06
tags:
  - Python
category: backend




---


**Web Scrappping**이란 웹페이지에서 데이터를 수집하는 모든 과정을 말한다. 크롤링과 혼용되어 사용되는 일이 많은데, 크롤링은 웹 페이지들을 수집, 분류하여 나중에 쉽게 찾아 볼 수 있도록 인덱싱 하는 작업이다. 따라서 스크래핑이 더 큰 범주에 속한다고 보면 된다.

파이썬에는 웹 스크래핑을 도와주는 다양한 모듈들이 있다. 그 중 몇가지를 소개한다.

## requests

`requests`는 http 요청을 아주 쉽게 수행하는 모듈이다.
[공식 사이트](https://requests.readthedocs.io/en/master/)를 참고하면 아주 오랫동안 사용되었고 버전도 굉장히 많이 나와있음이 확인된다.

- `get(url)` : url로 http request를 보내 해당 페이지에서 다양한 정보를 객체로 응답받는다.

```python
import requests
request = requests.get('https://google.com');
print(request.status_code)
```

요청이 정상적으로 완료 되면 `status_code` 변수에 200이 들어온다. 만약 요청을 보내는 사이트의 서버가 닫혀있거나 url이 존재하지 않는 주소라면 오류가 발생한다. 따라서 `try-exception`으로 에러 핸들링을 해주는 작업이 필요하다.

응답으로 받은 객체의 `text`에는 해당 페이지의 html 코드가 들어있다. 이를 parsing 하기 위해 아래 모듈을 사용한다.

## Beautiful Soup

request에서 받은 html 코드를 parsing 해주는 모듈이다. 다양한 분석 메서드를 제공한다.
[Beautiful Soup - Quick Start](https://www.crummy.com/software/BeautifulSoup/bs4/doc/#quick-start)

- `soup.tag_name` : 지정한 html 태그 엘리먼트를 찾는다.
- `soup.tag_name.string` : 지정한 html 태그 엘리먼트 내부의 text-content를 `string`으로 반환한다.
- `find_all()` : 조건에 맞는 모든 html 태그 엘리먼트를 찾아 배열로 반환한다.
- `find()` : 조건에 맞는 첫번째 html 태그 엘리먼트를 찾는다.

```python
from bs4 import BeautifulSoup
soup = BeautifulSoup(html_doc, 'html.parser')
soup.find(id="link3")
soup.find_all('a')

```

출력 결과

```python
<a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>

[<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>,
 <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,
 <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]
```
