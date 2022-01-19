import pino from 'pino';

const logger = pino(pino.destination('./subdomainBashError.log'));

if (process.env.dev) {
  logger.info = console.info;
  logger.error = console.error;
}
export { logger };
