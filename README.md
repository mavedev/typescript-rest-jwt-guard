# JwtGuard for typescript-rest
JwtGuard is a library to use in conjunction with [typescript-rest](https://github.com/thiagobustamante/typescript-rest#readme). The library provides a set of decorators to use them with controllers' methods. The purpose of the decorators in JWT access tokens availability control. There are several decorators depending on what token is supposed to be passed with.
## Installation
Using npm:
```shell
$ npm i typescript-rest-jwt-guard
```
Or using yarn:
```shell
$ yarn add typescript-rest-jwt-guard
```
## Usage with cookies
If access token is supposed to be passed with cookies, you must provide [cookie parser](https://github.com/expressjs/cookie-parser#readme):
```ts
app.use(cookieParser());
```
Now you can use decorators in your methods:
```ts
import { Path, GET, Context, ServiceContext } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { JwtCookieGuard } from 'typescript-rest-jwt-guard';

@Path('/test')
export default class DemoController {

  @JwtCookieGuard('BEARER')
  @Path('/cookie-jwt')
  @GET
  public getHealthStatusSecured(@Context _context: ServiceContext) {
    return { message: 'Ok' };
  }
}
```
Now requests to that route must provide a cookie with name BEARER and the JWT token as its value.
## Usage with authorization header
If access token is supposed to be passed with authorization header, you can use like this:
```ts
import { Path, GET, Context, ServiceContext } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { JwtHeaderGuard } from 'typescript-rest-jwt-guard';

@Path('/test')
export default class DemoController {

  @JwtHeaderGuard('Bearer')
  @Path('/header-jwt')
  @GET
  public getHealthStatusSecured(@Context _context: ServiceContext) {
    return { message: 'Ok' };
  }
}
```
Now all requests to that route must provide authorization header with value 'Bearer X' where X is the JWT access token.
## Usage with POST request body data
If access token is supposed to be passed with POST body data, you must provide [body parser](https://github.com/expressjs/body-parser#readme):
```ts
app.use(bodyParser.json());
```
Now you can use decorators in your methods:
```ts
import { Path, POST, Context, ServiceContext } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { JwtBodyGuard } from 'typescript-rest-jwt-guard';

@Path('/test')
export default class DemoController {

  @JwtBodyGuard('accessToken')
  @Path('/body-jwt')
  @POST
  public getHealthStatusSecured(@Context _context: ServiceContext) {
    return { message: 'Ok' };
  }
}
```
Now requests to that route must provide accessToken key inside their bodies with the JWT token as value.
