import { envVarNames } from '../constants';

class Common {
  static validateEnvVariables() {
    envVarNames.forEach((envName) => this.getEnvVariable(envName));
  }

  static getEnvVariable(envName: string) {
    const envValue = process.env[envName];
    if (envValue === undefined) {
      throw new Error(`${envName} is an undefined env variable`);
    }
    return envValue;
  }
}

export { Common };
