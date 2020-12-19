import path from 'path';

/**
 * Dynamically computed values.
 */
export default class Computed {
  public static readonly ROOT_DIR = require && require.main
    ? path.dirname(require.main.filename) : `../${__dirname}`;
}
