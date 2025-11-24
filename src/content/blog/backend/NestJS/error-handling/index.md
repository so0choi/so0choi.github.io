---
title: Nest.js 에러 처리 깔끔하게 하기
description: ''
pubDate: 2025-11-24 17:57:00
---

Nest.js는 Java Spring 프레임워크의 영향을 많이 받은 객체 지향형 프레임워크이다. 모듈간 의존성 주입 방식으로 프로젝트가 구성되는데 이때 컨트롤러와 서비스를 만들게 된다.

컨트롤러와 서비스는 주어진 역할이 명확히 구분되어 있다. 이를 혼동하여 코드를 작성하면 프로젝트가 커짐에 따라 혼돈이 발생할 것이다. 실제로 내 코드 또한 그랬다. 내가 작성한 컨트롤러는 컨트롤러와 서비스 역할을 모두 수행하는 괴물이었다. 서비스 레이어 또한 서비스 게층에서 해야 할 의무에 더해 의미 없는 전역 try-catch 구문과 에러 로깅 구문이 여기저기 흩뿌려져 있었다.

먼저 Controller와 Service의 역할을 명확히 정의해보자.

## Controller

컨트롤러의 역할은 들어온 request를 response 객체로 변환하는 것이다. 이를 위해 컨트롤러는 request 객체에서 데이터를 추출해 서비스 레이어에 전달한다. 서비스 레이어는 필요한 작업을 마친 뒤 컨트롤러에 돌려주고, MVC 모델에서는 컨트롤러가 전달받은 데이터를 View 계층에 주입해 렌더링을 수행한다.

컨트롤러가 잘못 설계되었음을 나타내는 레드 플래그들이 몇 가지 있다.

- 컨트롤러가 서비스 계층으로 너무 많은 요청을 보낸다.
- 컨트롤러가 서비스 계층으로 보내는 요청 중 상당수가 데이터를 반환하지 않는다.
- 컨트롤러가 서비스 계층으로 보내는 요청에 인자가 없다.

이런 플래그들이 보이기 시작했다는 것은 컨트롤러가 너무 많은 작업을 하고 있다는 증거다. 이런 경우 로직이 서비스 계층으로 추출되면 더 나은 구조로 만들 수 있을 가능성이 높다. 또한 컨트롤러가 서비스 계층으로 인자 없이 요청을 보내고 있다면, 서비스 계층이 캡슐화를 지키고 있지 않을 가능성이 있다.

컨트롤러는 http 파라미터를 검증하고, 어떤 서비스 메소드를 어떤 파라미터로 호출할지 결정하며 어떤 view를 렌더링 할지 결정하는 역할을 해야 한다. 비즈니스 로직 수행은 하지 않고 서비스에 위임해야 한다. 컨트롤러의 목적은 로직을 '실행'하는 것이 아니라, 로직 실행을 '요청'하는 것이다.

## Service

애플리케이션의  핵심 비즈니스 로직이 담긴 계층이다. 데이터 처리, 정책 정용, 외부 API 호출 등 실제 기능을 이루는 대부분의 로직이 서비스에 존재해야 한다.

데이터베이스 및 외부 서비스와의 통신 또한 서비스 계층에서 처리되어야 한다. 재사용성과 테스트 가능성을 보장하는 것이 좋은 서비스 레이어라고 할 수 있다. 

서비스 또한 레드플래그가 몇 가지 있다.

- 하나의 서비스가 너무 많은 도메인과 유즈케이스를 다룬다. (예: `UserService`가 회원가입, 로그인, 결제, 메일 발송 등의 로직을 모두 처리하는 경우)
- 서비스가 단순 리포지토리 패스스루가 되는 겨우
- 서비스가 컨트롤러의 역할을 대신해 Nest의 경우 `@Res()`를 넘겨받아 사용하는 경우
- 인자가 없는 서비스 메서드가 많은 경우 이는 외부 컨텍스트에 과하게 의존하고 있다는 의미가 된다.
- 반환값이 없는 메서드 또는 반환 타입이 항상 `boolean`/`number` 같은 원시 타입이 대부분인 경우, 서비스 결과가 지나치게 단순화되어 있어 컨트롤러 또는 상위 레이어가 로직을 재구성해야 해 책임이 역전될 수 있다.
- 생성자에 너무 많은 서비스가 주입되어 있는 경우 해당 서비스가 너무 많은 오케스트레이션 책임을 지고 있을 수 있다.

서비스 계층이 뚱뚱해졌다는 것은 도메인 경계가 제대로 그려지지 않았다는 신호이다. 

## Controller vs Service

각각을 정리해보았다. 표로 한눈에 들어오게 정리한다면 아래와 같다.

| 역할      | Controller         | Service                |
| ------- | ------------------ | ---------------------- |
| 목적      | HTTP 요청 처리 · 응답 반환 | 비즈니스 로직 수행             |
| 관심사     | I/O, 라우팅, 요청 변환    | 도메인 규칙, 정책, 데이터 처리     |
| 데이터 핸들링 | 요청 파라미터·DTO 처리     | DB·Redis·외부 API 호출     |
| 재사용성    | 낮음 (HTTP에 종속)      | 높음 (다른 Layer에서도 사용 가능) |
| 테스트성    | E2E 테스트 중심         | 단위 테스트 가능              |
| 책임      | 얇게 유지해야 함          | 핵심 로직을 모두 포함           |


## Nest.js 코드 리팩토링 하기

Stackoverflow에서 리팩토링 가능성이 있는 컨트롤러 코드를 가져왔다. 개선 전 내가 작성한 컨트롤러와 별반 다를것이 없다.

```typescript
// client.controller.ts
import {
    Body,
    Controller,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ClientService } from './client.service';
@Controller('client')

export class ClientController {
  constructor(
    private readonly clientService: ClientService,
  ) {}

  @Post('saveEmail')
  async saveEmail(
    @Body() changeEmailDto: ChangeEmailDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const oldEmail = (req.user as any)?.email;
    if (!oldEmail) {
      // 로그인 안 된 상태면 로그인 페이지 등으로 리다이렉트
      return res.redirect('/login');
    }
    
    // 기존 유저 조회
    const client = await this.clientService.getUserByEmail(oldEmail);

    // 비밀번호 비교
    const passwordOk = await this.clientService.isPasswordRight(
      changeEmailDto.currentPassword,
      client.password,
    );

    if (!passwordOk) {
      return res.status(400).render('client/editEmail', {
        wrongPassword: "Password doesn't match to real",
      });
    }

    const newEmail = changeEmailDto.newEmail;

    // 이메일이 실제로 변경되는지 확인
    if (this.clientService.isEmailChanged(oldEmail, newEmail)) {
      const isUnique = await this.clientService.isEmailUnique(newEmail);

      if (isUnique) {
        // 이메일 업데이트
        await this.clientService.editUserEmail(oldEmail, newEmail);
        
        // 프로필 페이지로 리다이렉트
        return res.redirect('/client/profile');
      } else {
        return res.status(400).render('client/editEmail', {
          email: oldEmail,
          emailExists: 'Such email is registered in system already',
        });
      }
    }

    // 새 이메일이 기존 이메일과 같다면 그냥 프로필로
    return res.redirect('/client/profile');
  }
}
```

먼저 컨트롤러의 역할인 파라미터 검증은 Nest.js의 `class-validator` + `ValidationPipe`로 400 처리 한다고 가정한다.
`@Res()` 데코레이터를 쓰는 것도 문제라면 문제가 될 수 있는데 Response 객체를 직접 써버리면 Nest의 인터셉터, 글로벌 필터, 응답 변환을 모두 받지 못하는 단점이 있다. 그래서 가능하다면 Response 객체를 직접 쓰는 것이 아닌, 값을 그대로 return 하거나 `@Render()` 데코레이터등을 이용하는 것이 좋다.

현재 이 컨트롤러는 비즈니스 로직을 너무 많이 수행하고 있다.
- 유저 조회
- 비밀번호 정확성 체크
- 이메일 변경 여부 판단
- 이메일 중복 여부 판단
- 이메일 저장
- username 갱신
- 뷰 렌더링과 리다이렉트 분기

```typescript
@Injectable()
export class ClientService {
    async updateEmail(changeEmailDto: ChangeEmailDto & { oldEmail: string }){
        const {oldEmail, newEmail, currentPassword} = changeEmailDto;
        
        // 기존 유저 조회
        const client = await this.getUserByEmail(oldEmail);

        // 비밀번호 비교
        const passwordOk = await this.isPasswordRight(
            currentPassword,
            client.password,
        );

        if (!passwordOk) {
            throw new BadRequestException({
                error: 'password is incorrect'
            })
        }
        
        if (!await this.isUnique(newEmail)) {
            throw new BadRequestException({
                error: 'Email already in use',
            })
        }
        
        const newUser = await this.userRepository.update({email: oldEmail}, {password: newPassword})
        
        return {
            ok: true,
            user: newUser,
        }
    } 
    
    
    
    async isUnique(email){
        return true;
    }
    
    getUserByEmail(email) {
        return user;
    }

    isPasswordRight(pw1, pw2) {
        return true;
    }
    
    
}
```



```typescript
// client.controller.ts
@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
  ) {}

  @Post('saveEmail')
  @UseGuards(LoggedInUserGuard)
  async saveEmail(
    @Body() changeEmailDto: ChangeEmailDto,
    @Req() req: Request,
  ) {
    // 로그인 상태 확인은 LoggedInUserGuard에서 처리
        // 이메일 업데이트
      const oldEmail = (req.user as any).email;
        return await this.clientService.updateEmail({...changeEmailDto, oldEmail});
        
        //결과만 JSON으로 반환하고 redirect는 view 레이어에서 처리하도록 한다
  }
}
```

1차로 이렇게 리팩토링을 진행했다. 여기서 아쉬운 부분을 찾자면 서비스가 HTTP 에러를 직접 던지게 되면 HTTP에 종속되게 된다. 서비스에서는 도메인 에러만 날리는 패턴이 좀 더 실용적이라고 한다.

도메인 에러란,

```typescript
// domain-errors.ts
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class WrongPasswordError extends DomainError {
  constructor() {
    super('Password is incorrect');
  }
}

export class EmailAlreadyInUseError extends DomainError {
  constructor() {
    super('Email already in use');
  }
}

```

이렇게 HTTP 상태 코드 등 응답에 관련된 직접적인 내용은 전혀 고려하지 않는 에러 객체이다.
위 1차 리팩토링 코드의 `BadRequestException`을 줬던 부분을 다음과 같이 수정 가능하다.

```typescript
if (!passwordOk) {
      // ❗ HTTP 예외가 아니라 도메인 예외
      throw new WrongPasswordError();
    }

const isUnique = await this.isEmailUnique(newEmail);
if (!isUnique) {
  throw new EmailAlreadyInUseError();
}
```

그리고 HTTP 응답은 컨트롤러가 처리하도록 한다.

```typescript
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('saveEmail')
  @Redirect('/client/profile')
  async saveEmail(
    @Body() dto: ChangeEmailDto,
    @Req() req: Request,
  ) {
    const oldEmail = (req.user as any).email;

    try {
      return await this.clientService.updateEmail({
        oldEmail,
        newEmail: dto.newEmail,
        currentPassword: dto.currentPassword,
      });
    } catch (e) {
      if (e instanceof WrongPasswordError) {
        throw new BadRequestException({
          error: 'password_incorrect',
          message: e.message,
        });
      }

      if (e instanceof EmailAlreadyInUseError) {
        throw new ConflictException({
          error: 'email_already_in_use',
          message: e.message,
        });
      }

      // 예상치 못한 에러는 그대로 터뜨리기 (전역 필터/로거에서 처리)
      throw e;
    }
  }
}
```
이 방법도 있지만 Nest.js의 기능인 `ExceptionFilter`를 쓰면 컨트롤러마다 처리하지 않아도 된다.

```typescript
// domain-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  DomainError,
  WrongPasswordError,
  EmailAlreadyInUseError,
} from './domain-errors';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    if (exception instanceof WrongPasswordError) {
      const httpError = new BadRequestException({
        error: 'password_incorrect',
        message: exception.message,
      });
      const response = httpError.getResponse();
      res.status(httpError.getStatus()).json(response);
      return;
    }

    if (exception instanceof EmailAlreadyInUseError) {
      const httpError = new ConflictException({
        error: 'email_already_in_use',
        message: exception.message,
      });
      const response = httpError.getResponse();
      res.status(httpError.getStatus()).json(response);
      return;
    }

    // 기타 DomainError는 기본 400으로
    const httpError = new BadRequestException({
      error: 'domain_error',
      message: exception.message,
    });
    const response = httpError.getResponse();
    res.status(httpError.getStatus()).json(response);
  }
}

```

```typescript
// main.ts
app.useGlobalFilters(new DomainExceptionFilter());
```

 

## 결론

서비스는 '무엇을 할지'를, 컨트롤러는 '어떻게 응답할지'를 책임져야 한다.


# 참고
- [A Better Understanding Of MVC (Model-View-Controller) Thanks To Steven Neiland](https://www.bennadel.com/blog/2379-a-better-understanding-of-mvc-model-view-controller-thanks-to-steven-neiland.htm)
- [Service layer and controller: who takes care of what?](https://stackoverflow.com/questions/3885675/service-layer-and-controller-who-takes-care-of-what)
