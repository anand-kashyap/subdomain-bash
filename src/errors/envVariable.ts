/**
 * Custom Error class for process.env variables
 */
class EnvVarError extends Error {
  constructor(envVarName: string) {
    super('Missing Env variable: ' + envVarName);
    Object.setPrototypeOf(this, EnvVarError.prototype);
  }
}

export { EnvVarError };
