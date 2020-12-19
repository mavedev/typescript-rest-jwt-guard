import { Path, GET, Context, ServiceContext } from 'typescript-rest';
import { Inject } from 'typescript-ioc';

import Types from '@types';
import DemoService from '@services/Demo';

import { JwtCookieGuard, JwtHeaderGuard, JwtBodyGuard } from '../../../lib';

/**
 * Default controller in charge of checking the API.
 */
@Path('/test')
export default class DemoController {
  public constructor(@Inject private readonly injectedService: DemoService) {}

  /**
   * Simple test route.
   */
  @GET
  public getDemoReply(): Types.HealthResponseDTO {
    return this.injectedService.getHealthStatus();
  }

  /**
   * JWT passed with cookies.
   */
  @JwtCookieGuard('BEARER')
  @Path('/cookie-jwt')
  @GET
  public getDemoReplyCookie(@Context _context: ServiceContext): Types.HealthResponseDTO {
    return this.injectedService.getHealthStatus();
  }

  /**
   * JWT passed with authorization header.
   */
  @JwtHeaderGuard('Bearer')
  @Path('/header-jwt')
  @GET
  public getDemoReplyHeader(@Context _context: ServiceContext): Types.HealthResponseDTO {
    return this.injectedService.getHealthStatus();
  }

  /**
   * JWT passed with POST request body data.
   */
  @JwtBodyGuard('accessToken')
  @Path('/body-jwt')
  @GET
  public getDemoReplyBody(@Context _context: ServiceContext): Types.HealthResponseDTO {
    return this.injectedService.getHealthStatus();
  }
}
