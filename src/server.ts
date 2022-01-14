import { Server } from 'socket.io';
import { Common } from './utils';
Common.validateEnvVariables(); // ! should be called first

const port = (process.env.PORT || 3000) as number,
  io = new Server(port, { cors: { origin: '*' } });

console.log('socket connected to port:', port, process.env.subDomain);

io.on('connection', (socket) => {
  console.log('connected');
});

export { io };
