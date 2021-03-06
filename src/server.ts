import { Server } from 'socket.io';
import { logger } from './config/logger';
import { CustomEvents } from './constants';
import { Common, netlifyClientCreator, subdomainCreator as subdomainInsCreator } from './utils';
Common.validateEnvVariables(); // ! should be called first

const port = (process.env.PORT || 3000) as number,
  io = new Server(port, { cors: { origin: '*' } });

logger.info('🐱‍👓 socket connected to port:', port);

io.on('connection', (socket) => {
  logger.info('connected');
  const netlifyClient = netlifyClientCreator(),
    subdomainCreator = subdomainInsCreator(socket);

  socket.on(
    CustomEvents.ADD_SUBDOMAIN,
    async ({ port, subDomain, mainDomain = 'anandkashyap.in', appName = subDomain, repoUrl, repoName }) => {
      Common.addObjectValuesToProcessEnv({
        port,
        subDomain,
        mainDomain,
        appName,
        repoUrl,
        repoName,
      });
      socket.emit(CustomEvents.PROCESS_STARTED);
      await subdomainCreator.seqExecBashCommands(netlifyClient);
    }
  );
});
export { io };
