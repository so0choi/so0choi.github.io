---
title: "[CS] Singleton pattern(JS)"
description: 'Singleton pattern은 생성자가 여러 차례 호출되더라도 실제 생성되는 객체는 하나이고 최초 생성 이후에 호출된 생성자는 최초 생성자가 생성한 객체를 리턴하는 디자인 유형이다. 주로 공통된 객체를 여러개 생성해 사용하는 Database Connection Pool과 같은 상황에서 많이 사용된다. 몇 가지 단점도…'
heroImage: '../../../../../assets/posts/singleton-pattern/202305181147.png'
pubDate: 2023-05-16 09:45:44
tags:
category: CS 


---



Singleton pattern은 생성자가 여러 차례 호출되더라도 실제 생성되는 객체는 하나이고 최초 생성 이후에 호출된 생성자는 최초 생성자가 생성한 객체를 리턴하는 디자인 유형이다. 주로 공통된 객체를 여러개 생성해 사용하는 Database Connection Pool과 같은 상황에서 많이 사용된다.

![](../../../../../assets/posts/singleton-pattern/202305181147.png)

몇 가지 단점도 있는 패턴이다.

- Single responsibility 원칙을 저해한다. 두 가지 문제를 한 번에 해결해버리는 패턴이다. 한 가지는, '하나의 클래스는 하나의 인스턴스만 가질 것' 다른 문제는 '단 하나의 클래스 인스턴스로 글로벌 액세스 포인트를 제공할 것'이다. 
- 유닛 테스트를 작성하기 힘들어진다. 글로벌 변수의 현재 상태는 실행 순서에 따라 값이 달라지기 때문이다. 또한 글로벌 인스턴스이기 때문에 테스트 중 다른 컴포넌트가 상태를 변화시킬 수 있어 디버깅이 어려워질 수 있다.

자바스크립트에서 singleton pattern을 구현하는 방법은 여러가지가 있다.

## 클로저를 이용하는 방법

```js
const Singleton = (function (){
    let instance;
    
    function setInstance(){
        instance = {
            id: 1,
            text: 'hello',
        };
    }
    
    return {
        getInstance() {
            if(!instance) {
                setInstance();
            }
            return instance;
        }
    };
})();

const singletonA = Singleton.getInstance();
const singletonB = Singleton.getInstance();

console.log(singletonA === singletonB); // true
```

## module pattern 방식

ES6 Module을 사용하여 간단하게 singleton을 구현할 수 있는 `module pattern`도 존재한다.

```js
// my-singleton.js
const somePrivateState = []

function privateFn () {
  // ...
}

export default {
  method1() {
    // ...
  },
  method2() {
    // ...
  }
}
```

선언한 singleton 모듈을 import 하면 된다.

```js
import myInstance from './my-singleton.js'
// ...
```

## Object.freeze() 를 사용하는 방법

```js
let instance;
let globalState = {
  color: ""
};

class StateUtility {
  constructor() {
    if (instance) {
      throw new Error("New instance cannot be created");
    }

    instance = this;
  }

  getPropertyByName(propertyName) {
    return globalState[propertyName];
  }

  setPropertyValue(propertyName, propertyValue) {
    globalState[propertyName] = propertyValue;
  }
}

let stateUtilityInstance = Object.freeze(new StateUtility());

export default stateUtilityInstance;
```

## ES10(ES2019) 이후 `#` 키워드를 이용하는 방법

ES10 이후 추가된 `#`를 사용해 private 클래스 필드를 선언할 수 있다.

```js
class Singleton {
    static #instance;
    constructor() {
        if(Singleton.#instance) return Singleton.#instance;
        Singleton.#instance = this;
    }
}

let a = new Singleton();
let b = new Singleton();
console.log(a === b); // true
```

## 참고
- [singleton design pattern with javascript](https://www.freecodecamp.org/news/singleton-design-pattern-with-javascript/)
- [JS 싱글톤 패턴(Singleton Pattern)](https://woong-jae.com/javascript/220319-singleton-pattern)
- [Simplest/cleanest way to implement a singleton in JavaScript](https://stackoverflow.com/questions/1479319/simplest-cleanest-way-to-implement-a-singleton-in-javascript)
- [MDN - Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)
