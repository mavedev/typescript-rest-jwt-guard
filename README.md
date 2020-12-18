# JwtGuard for typescript-rest
## Installation
Using npm:
```shell
$ npm i typescript-rest-jwt-guard
```
Or using yarn:
```shell
$ yarn add typescript-rest-jwt-guard
```
## Usage
First, you must provide [cookie parser](https://github.com/expressjs/cookie-parser#readme):
```ts
app.use(cookieParser());
```
Now you can use the decorator in your methods:
```ts
import { Path, GET, Context, ServiceContext } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import JwtGuard from 'typescript-rest-jwt-guard';

@Path('/health')
export default class HealthController {

  // Simple method.
  @GET
  public getHealthStatus() {
    return { message: 'Ok' };
  }

  // Method requiring JWT.
  @JwtGuard
  @Path('/secured')
  @GET
  public getHealthStatusSecured(@Context _context: ServiceContext) {
    return { message: 'Ok' };
  }
}
```
