import { ServiceContext, Errors } from 'typescript-rest';
import jwt from 'jsonwebtoken';

/**
 * Get token name and value from string.
 *
 * @param {string} str String to retrieve values from.
 */
function retrievePair(str: string): string[] {
  return str.trim().replace(/\s+/g, ' ').split(' ');
}

/**
 * Check if the request context is provided.
 *
 * @param {object|undefined} context Request context
 */
function checkContext(context?: object): void {
  if (!context) {
    throw new Errors.InternalServerError(
      'No context provided.'
    );
  }
}

/**
 * Check if JWT secret is defined.
 */
function checkSecret(): void {
  if (!process.env.JWT_SECRET) {
    throw new Errors.InternalServerError(
      'Token secret not provided at server.'
    );
  }
}

/**
 * JWT-checking decorator to be used with typescript-rest as annotation.
 * Used when JWT is passed with cookies.
 */
export function JwtCookieGuard(tokenName: string) {
  return (
    _target: Object,
    _key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;

    // eslint-disable-next-line
    descriptor.value = function (...args: any[]) {
      const context = args.find((arg) => arg instanceof ServiceContext);

      checkContext(context);

      const accessToken = (context as ServiceContext).request.cookies[tokenName];

      if (!accessToken) {
        throw new Errors.UnauthorizedError(
          `No '${tokenName}' access token provided.`
        );
      }

      checkSecret();

      try {
        jwt.verify(accessToken, process.env.JWT_SECRET as string);
      } catch (error) {
        throw new Errors.ForbiddenError(
          'Invalid or expired JWT provided.'
        );
      }

      return original.apply(this, args);
    };
  };
}

/**
 * JWT-checking decorator to be used with typescript-rest as annotation.
 * Used when JWT is passed with authorization header.
 */
export function JwtHeaderGuard(tokenName: string) {
  return (
    _target: Object,
    _key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;

    // eslint-disable-next-line
    descriptor.value = function (...args: any[]) {
      const context = args.find((arg) => arg instanceof ServiceContext);

      checkContext(context);

      const authHeader = (context as ServiceContext).request.headers['authorization'];

      if (!authHeader) {
        throw new Errors.UnauthorizedError(
          'No authorization header provided.'
        );
      }

      const [headerTokenName, token] = retrievePair(authHeader);

      if (!headerTokenName || !token) {
        throw new Errors.UnauthorizedError(
          'Incorrect authorization token value.'
        );
      }

      if (headerTokenName !== tokenName) {
        throw new Errors.UnauthorizedError(
          `Token name '${headerTokenName}' is not the one that is expected: '${tokenName}'.`
        );
      }

      checkSecret();

      try {
        jwt.verify(token, process.env.JWT_SECRET as string);
      } catch (error) {
        throw new Errors.ForbiddenError(
          'Invalid or expired JWT provided.'
        );
      }

      return original.apply(this, args);
    };
  };
}

/**
 * JWT-checking decorator to be used with typescript-rest as annotation.
 * Used when JWT is passed with request post body data.
 */
export function JwtBodyGuard(tokenKey: string) {
  return (
    _target: Object,
    _key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;

    // eslint-disable-next-line
    descriptor.value = function (...args: any[]) {
      const context = args.find((arg) => arg instanceof ServiceContext);

      checkContext(context);

      const body = (context as ServiceContext).request.body || {};

      if (!(tokenKey in body)) {
        throw new Errors.UnauthorizedError(
          `Request body does not contain '${tokenKey}' key.`
        );
      }

      checkSecret();

      try {
        jwt.verify(body[tokenKey], process.env.JWT_SECRET as string);
      } catch (error) {
        throw new Errors.ForbiddenError(
          'Invalid or expired JWT provided.'
        );
      }

      return original.apply(this, args);
    };
  };
}
