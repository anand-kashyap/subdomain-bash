import pino from 'pino';

const logger = pino(
  process.env.dev ? {} : pino.destination('./subdomainBashError.log')
);

export { logger };
