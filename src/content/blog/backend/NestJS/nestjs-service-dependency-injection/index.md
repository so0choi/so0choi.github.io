---
title: NestJS Service 상속을 해도 될까? 
description: '현재 만들고있는 app의 구조를 개선하던중 service 상속과 dependency injection에 대해 고민하게 되었다. 내가 맡은 프로세스는, A 요청시 A 컴포넌트를 실행하고 B 요청시 B 컴포넌트를 실행한다. A와 B는 각각의 설정 방법이 다르지만 공통적으로 사전에 수행되어야하는 작업들이 있다. 코드를 넘겨받…'
pubDate: 2022-12-27 16:46:19
category: NestJS

---


현재 만들고있는 app의 구조를 개선하던중 service 상속과 dependency injection에 대해 고민하게 되었다. 
내가 맡은 프로세스는, A 요청시 A 컴포넌트를 실행하고 B 요청시 B 컴포넌트를 실행한다. A와 B는 각각의 설정 방법이 다르지만 공통적으로 사전에 수행되어야하는 작업들이 있다. 
코드를 넘겨받을 당시 가장 초기 구조는 A와 B 각 provider에 같은 코드가 작성되어 실행되고 있었다. 이렇게 할 경우 수정사항이 생겼을 때 한 곳만 고친다던가 하는 실수가 잦았다. 초반에는 A 서비스만 제공했기 떄문에 B를 추가하면서 복붙한 것 같다. 하지만 그 뒤에 C 서비스까지 들어온 것으로 보인다.
이렇게는 안되겠다! 싶어서 리팩토링을 진행하면서 공통 작업을 수행하는 provider를 생성하고 A, B, C에서 `extends` 하도록 했다. 이렇게 할 경우 constructor가 너무 지저분해져서 방법을 찾다가 service 상속은 NestJS가 지향하는 것과 맞지 않다는 글을 보게 되었다.. 

> No, it is not a good idea. Why? Because in NestJS, "service" is a synonym for dependency (it is a kind of provider).
Therefore, the assumption that dependencies should share some parts of their implementation seems unnecessary. The dependencies will differ (because they do different things; they provide different functionalities!), so they are not alike.
> 
> In general, the trait you describe is named the Layer Supertype, and you can read more about it here: [https://www.martinfowler.com/eaaCatalog/layerSupertype.html](https://www.martinfowler.com/eaaCatalog/layerSupertype.html)
> 
> If somebody asked me whether I consider all the services in Nest.js a "layer", I would say no. If you, however, discover a particular kind of services (like, Repositories), then they might qualify for a common parent, implementation-wise. A "Data Access Layer" is a layer (says so in the name, duh), and it naturally benefits from some code sharing.

하지만 글의 말미에 언급된 것 처럼 경우에 따라서는 공통의 parent를 두고 code sharing을 함으로써 얻어지는 이득도 있다고 한다. 필요에 의해서 충분히 구조에 대해 고민해본 뒤에는 사용해봐도 괜찮을 것 같다.

Nest.js의 공식 문서를 처음부터 끝까지 읽어보고 있는데 많은 도움이 되고있다. 블로그나 깃북에 정리된 내용들은 전체 문서를 요약한 느낌이라 일단 공식 문서를 한 번 쫘악 읽는 것이 우선순위였는데 그걸 몰랐네. 공식 문서를 읽는 습관을 들여야겠다!~
## 참고
- [Nestjs Question: is it a good idea for services to inherit from a base service ?](https://www.reddit.com/r/node/comments/ybem5w/nestjs_question_is_it_a_good_idea_for_services_to/)
