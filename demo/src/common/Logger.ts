import Types from '@types';

/**
 * Simple logger class to output info to console.
 */
export default class Logger {
  private static instance: Logger = new Logger();

  /**
   * Precondition returning the logger instance
   * if the app is running in the development mode.
   *
   * @returns {Logger|null} The logger instance or null
   */
  public static ifdev(): Types.Nullable<Logger> {
    return process.env.NODE_ENV === 'development' ? Logger.instance : null;
  }

  /**
   * Log to file.
   *
   * @param {string} message Message
   */
  public log(message: string): void {
    console.log(message);
  }
}
