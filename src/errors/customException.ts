import { BaseError } from './base';

/**
 * Custom Error for static, logical errors
 */
class CustomException extends BaseError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomException.prototype);
  }
}

export { CustomException };
