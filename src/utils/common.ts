class Common {
  static getEnvVariable(...envNames: string[]) {
    return envNames.map((envName) => {
      const envValue = process.env[envName];
      if (envValue === undefined) {
        throw new Error(`${envName} is an undefined env variable`);
      }
      return envValue;
    });
  }
}

export { Common };
