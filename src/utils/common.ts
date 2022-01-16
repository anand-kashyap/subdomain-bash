import { envVarNames } from '../constants';

class Common {
  static validateEnvVariables() {
    envVarNames.forEach((envName) => this.getEnvVariable(envName));
  }

  static validateAllArgsPresent(...args: any[]) {
    args.forEach((arg) => {
      if (!Boolean(arg)) {
        console.log('all args', args);
        throw new Error(`invalid arg - ${arg}`);
      }
    });
  }

  static getEnvVariable(envName: string) {
    const envValue = process.env[envName];
    if (envValue === undefined) {
      throw new Error(`${envName} is an undefined env variable`);
    }
    return envValue;
  }

  static addObjectValuesToProcessEnv(obj: any) {
    this.validateAllArgsPresent(...obj);
    console.log('setting env vars from function args');
    process.env = { ...process.env, ...obj };
  }
}

export { Common };
