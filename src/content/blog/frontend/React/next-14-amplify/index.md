---
title: NextJS 14 AWS Amplify로 배포하기
description: 'Amplify로 새 애플리케이션을 만들고 자동으로 선택되는 이미지는 Node v16을 사용해 Next.js 빌드 과정에서 에러가 발생한다. 이를 해결하기 위해서는 콘솔의 의 빌드 이미지를 수정하면 된다. 2024.01.15 기준으로 Amazon Linux:2023 을 사용하면 Node.js 버전 관련 에러가 발생하지 않…'
pubDate: 2024-01-15 15:22:03
tags:
  - NextJS
category: frontend





---


Amplify로 새 애플리케이션을 만들고 자동으로 선택되는 이미지는 Node v16을 사용해 Next.js 빌드 과정에서 에러가 발생한다.

```
                                 # Starting phase: preBuild
                                 # Executing command: npm ci
2024-01-15T04:25:12.847Z [WARNING]: npm
2024-01-15T04:25:12.848Z [WARNING]: WARN EBADENGINE Unsupported engine {
                                    npm WARN EBADENGINE   package: 'next@14.0.4',
                                    npm WARN EBADENGINE   required: { node: '>=18.17.0' },
                                    npm WARN
2024-01-15T04:25:12.849Z [WARNING]: EBADENGINE   current: { node: 'v16.19.0', npm: '8.19.3' }
                                    npm WARN EBADENGINE }
2024-01-15T04:25:22.504Z [INFO]: added 362 packages, and audited 363 packages in 12s
2024-01-15T04:25:22.507Z [INFO]: 128 packages are looking for funding
                                 run `npm fund` for details
                                 found 0 vulnerabilities
2024-01-15T04:25:22.517Z [INFO]: # Completed phase: preBuild
                                 # Starting phase: build
2024-01-15T04:25:22.518Z [INFO]: # Executing command: npm run build
2024-01-15T04:25:22.835Z [INFO]: > y@0.1.0 build
                                 > next build
2024-01-15T04:25:22.885Z [WARNING]: You are using Node.js 16.19.0. For Next.js, Node.js version >= v18.17.0 is required.
2024-01-15T04:25:22.892Z [ERROR]: !!! Build failed
```

이를 해결하기 위해서는 콘솔의 `빌드 설정 > Build image settings`의 빌드 이미지를 수정하면 된다.
2024.01.15 기준으로 Amazon Linux:2023 을 사용하면 Node.js 버전 관련 에러가 발생하지 않는다.


