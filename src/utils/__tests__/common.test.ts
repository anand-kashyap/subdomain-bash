import { Common } from '../common';

describe('Common Class Util', () => {
  it('should be a Class', () => {
    const object = new Common();
    expect(object).toBeDefined();
  });

  it('should only have static methods', () => {
    const object: any = new Common();
    expect(object.getEnvVariable).toBeUndefined();
  });

  describe('validateAllArgsPresent Method', () => {
    it('should throw error if any argument passed to func is falsy value', () => {
      const fn1 = () =>
        Common.validateAllArgsPresent('red', 123, 'foo124 89', 876.23);
      expect(fn1).not.toThrowError();

      const fn2 = () => Common.validateAllArgsPresent('red', 123, null, 876.23);
      expect(fn2).toThrowError();
    });
  });

  describe('getEnvVariable Method', () => {
    it('should return value if process.env variable present', () => {
      process.env.testVar = 'test string desc';
      const envName = 'testVar';
      const envValue = Common.getEnvVariable(envName);
      expect(envValue).toEqual(process.env.testVar);
    });

    it('should throw error if process.env variable is missing', () => {
      const envName = 'random';
      const fn = () => Common.getEnvVariable(envName);
      expect(fn).toThrowError();
    });
  });
});
