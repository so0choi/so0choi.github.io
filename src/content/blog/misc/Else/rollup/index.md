---
title: rollup.js
description: 'rollup.js는 javascript module 번들러이다. 번들링 라이브러리라는 면에서 webpack과 같은 역할을 한다고 볼 수 있는데, 보통 webpack은 애플리케이션 번들링에 사용하고 라이브러리 제작에는 rollup을 사용하는 것이 일반적이라고 한다. rollup 또한 webpack 처럼 모든 기능을 자체적…'
pubDate: 2025-03-11 10:17:29
tags:

---


[rollup.js](https://rollupjs.org/)는 javascript module 번들러이다. 번들링 라이브러리라는 면에서 webpack과 같은 역할을 한다고 볼 수 있는데, 보통 webpack은 애플리케이션 번들링에 사용하고 라이브러리 제작에는 rollup을 사용하는 것이 일반적이라고 한다. rollup 또한 webpack 처럼 모든 기능을 자체적으로 제공하는 것이 아니라 다양한 plugin에 의존한다. 사용자가 필요에 따라 plugin을 설치해 원하는 목적을 달성할 수 있도록 하는 방식이다.

## Javascript Modules

rollup을 사용하려면 javascript 모듈의 다양한 format을 알고 있어야 한다.

### CommonJS (CJS)

- 주로 Node.js 환경에서 사용하는 모듈 시스템이다.
- 동기적으로 모듈을 로드한다.
- `require()` 함수를 사용해 모듈을 가져오고, `module.exports` 또는 `exports` 객체를 통해 모듈을 내보낸다.

```js
// math.js (모듈 파일)
function add(a, b) {
  return a + b;
}
module.exports = { add };

// app.js (사용 예)
const math = require('./math');
console.log(math.add(2, 3)); // 5
```

### UMD (Universal Module Definition)

- 브라우저와 Node.js 모두에서 작동하도록 설계된 모듈 형식이다.
- AMD와 CommonJS를 모두 지원하며, 전역 변수로도 노출할 수 있다.
- 라이브러리를 브라우저와 Node.js 모두에서 사용해야 하는 경우, UMD 번들 형태로 배포하여 다양한 환경에서 사용할 수 있다.

```js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node, CommonJS-like
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.myModule = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  // 모듈 내용
  function greet(name) {
    return 'Hello, ' + name;
  }
  return { greet };
}));

```

### AMD (Asynchronous Module Definition)

- 브라우저 환경에서 비동기적으로 모듈을 로드하기 위해 고안되었다.
- 로딩 최적화에 유리하다.
- 브라우저에서 비동기 로드가 필요한 경우 사용하지만, ESM이 표준화되면서 사용 빈도가 줄어들고 있다. 

```js
// math.js
define([], function() {
  return {
    add: function(a, b) {
      return a + b;
    }
  };
});

// app.js
require(['math'], function(math) {
  console.log(math.add(2, 3)); // 5
});

```

### ESM (ES Modules)

- ECMAScript 표준에 포함된 모듈 시스템으로, 최신 브라우저와 Node.js v12에서 기본적으로 지원된다.
- `import`, `export` 구문을 사용한다.
- 정적 분석이 가능하여 tree-shaking 등 번들러 최적화에 유리하다.
- 현대 웹 개발에서 권장되는 방식이다.

```js
// math.mjs
export function add(a, b) {
  return a + b;
}

// app.mjs
import { add } from './math.mjs';
console.log(add(2, 3)); // 5

```

## tree-shaking

rollup은 ESM 방식으로 코드를 작성할 수 있게 하는 것 말고도 tree-shaking을 지원한다.

**tree-shaking**: 코드의 import를 분석해 사용되지 않는 dead code는 번들링에서 제외하는 것

예를 들어 CJS로 코드를 작성하면,

```js
// import the entire utils object with CommonJS
const utils = require('./utils');
const query = 'Rollup';
// use the ajax method of the utils object
utils.ajax(`https://api.example.com?search=${query}`).then(handleResponse);
```
 
ajax를 사용하기 위해 utils 모듈을 전부 import 해야 한다. 하지만 ESM으로 코드를 작성한다면,

```js
// import the ajax function with an ES6 import statement
import { ajax } from './utils';
const query = 'Rollup';
// call the ajax function
ajax(`https://api.example.com?search=${query}`).then(handleResponse);
```

utils 파일에서 사용하고자 하는 ajax 모듈만 import가 가능하다. 이런 식으로 필요한 코드만 번들링에 포함될 수 있도록 하는 것을 tree-shaking이라고 한다. ouput 코드의 크기를 더 효율적으로 줄일 수 있다.

## configuration 파일 작성

cli로도 rollup 실행은 가능하다. 

```shell
rollup main.js --file bundle.js --format iife
# main.js 파일을 iife 포맷으로 번들링하여 bundle.js output을 만드는 command
```

하지만 plugin을 추가하고 더 복잡한 작업을 실행하기 위해서는 config 파일을 작성은 옵션이 아닌 필수라고 봐도 무방하다.
일반적으로 rollup config 파일은 `rollup.config.js`로 작성한다.

```js
export default {
	input: 'src/main.js',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	},
    external: [],
    plugins: [],
};
```

위와 같은 config를 작성했다면 `rollup -c`로 rollup을 실행할 수 있다.
config 파일을 typescript로 작성하는 것도 가능하다.
```shell
rollup --config rollup.config.ts --configPlugin typescript
```

### 다양한 input, output 만들기

config는 하나의 객체가 될 수도 있지만 배열이 될 수도 있다. 다양한 input 파일에 대해 다른 output을 만들고 싶거나, 하나의 input으로 다양한 output을 만드는 것 모두 가능하다.

```js
// rollup.config.js (building more than one bundle)

export default [
	{
		input: 'main-a.js',
		output: {
			file: 'dist/bundle-a.js',
			format: 'cjs'
		}
	},
	{
		input: 'main-b.js',
		output: [
			{
				file: 'dist/bundle-b1.js',
				format: 'cjs'
			},
			{
				file: 'dist/bundle-b2.js',
				format: 'es'
			}
		]
	}
];
```
### external 

rollup은 사용자가 직접 작성한 모듈을 제외한 외부 모듈은 번들링 결과물에 포함시키지 않고 단순히 가리키기만 한다. 그래서 번들링한 파일을 누군가 가져다 사용하려 할 때 외부 모듈을 따로 설치하지 않는다면 정상적으로 실행이 불가능하다. 이런 경우 package.json에 `devDependency`가 아닌 `dependency`에 모듈을 설치해두고 npm에 배포하면 알아서 `node_modules`에 설치가 되기는 한다. 하지만 rollup 공식 문서는 외부 라이브러리를 명시할 것을 권장한다. `rollup.config.js` 파일의 `external`에 추가하면 된다.

```js
export default {
	input: 'src/main.js',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	},
    external: [],
    plugins: [],
};
```

## plugin

다양하고 유용한 plugin이 정말 많다. 이번 프로젝트에서 사용한 plugin 몇 개만 정리해두려고 한다.

- @rollup/plugin-node-resolve: 외부 플러그인 tree shaking을 실행해 주는 플러그인
- @rollup/plugin-commonjs: CommonJS로 작성된 외부 모듈을 ES6로 바꿔서 rollup이 읽을 수 있도록 하는 플러그인
