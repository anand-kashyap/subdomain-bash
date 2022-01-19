import { BaseError } from './base';

/**
 * Custom Error class for process.env variables
 */
class EnvVarError extends BaseError {
  constructor(envVarName: string) {
    super('Missing Env variable: ' + envVarName);
    Object.setPrototypeOf(this, EnvVarError.prototype);
  }
}

export { EnvVarError };
