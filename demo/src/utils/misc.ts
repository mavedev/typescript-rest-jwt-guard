/**
 * This module contains small miscellaneous functions.
 */

/**
 * Dummy function (for testing purpose).
 */
export const getDummy = () => {};

/**
 * Check if all the arguments specified are defined.
 *
 * @param {any[]} args Arguments provided
 */
export const areDefined = (...args: any[]) => (
  args.every((arg) => typeof arg !== 'undefined')
);

/**
 * Check if the argument specified is defined.
 *
 * @param {any} arg Argument provided
 */
export const isDefined = (arg: any) => typeof arg !== 'undefined';

/**
 * Check if the argument specified is string.
 *
 * @param {any} arg Argument provided
 */
export const isString = (arg: any) => typeof arg === 'string';

/**
 * Get stringified boolean value if possible.
 *
 * @param {string} arg Argument provided.
 */
export const parseBoolean = (arg: string) => arg === 'true';
