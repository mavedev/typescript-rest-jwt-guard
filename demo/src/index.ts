import 'module-alias/register';
import 'source-map-support/register';

import startServer from '@application';

/**
 * The entry point.
 */
if (require.main === module) {
  startServer();
}
