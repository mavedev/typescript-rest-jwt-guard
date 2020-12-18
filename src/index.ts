import { ServiceContext, Errors } from 'typescript-rest';
import jwt from 'jsonwebtoken';

/**
 * JWT-checking decorator to be used with typescript-rest as annotation.
 */
export default function JwtGuard(
  _target: Object,
  _key: string | symbol,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  // eslint-disable-next-line
  descriptor.value = function (context: ServiceContext, ...args: any[]) {
    const accessToken = context.request.cookies['BEARER'];

    if (!accessToken) {
      throw new Errors.UnauthorizedError('No access token provided.');
    }

    try {
      jwt.verify(accessToken, process.env.SECRET as string);
    } catch (error) {
      throw new Errors.ForbiddenError('Invalid or expired JWT provided.');
    }
    return original.apply(this, args);
  };
}
