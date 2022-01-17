import { logger } from '../config/logger';

/**
 * Custom Error for saving logs
 */
class BaseError extends Error {
  constructor(message: string) {
    logger.error(message);
    super(message);
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export { BaseError };
