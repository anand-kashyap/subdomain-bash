import { envVarNames } from '../constants';
import { CustomException, EnvVarError } from '../errors';

class Common {
  static validateEnvVariables() {
    envVarNames.forEach((envName) => this.getEnvVariable(envName));
  }

  static validateAllArgsPresent(...args: any[]) {
    args.forEach((arg) => {
      if (!Boolean(arg)) {
        console.log('all args', args);
        throw new CustomException(`invalid arg - ${arg}`);
      }
    });
  }

  static getEnvVariable(envName: string) {
    const envValue = process.env[envName];
    if (!envValue) throw new EnvVarError(envName);
    return envValue;
  }

  /**
   * set process.env vars from a json
   * @param obj any valid json object
   */
  static addObjectValuesToProcessEnv(obj: any) {
    this.validateAllArgsPresent(...obj);
    console.log('setting env vars from function args');
    process.env = { ...process.env, ...obj };
  }
}

export { Common };
