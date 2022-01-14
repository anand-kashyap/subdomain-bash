import { Server } from 'socket.io';
import { netlifyHttpService } from './services/netlifyAxios';

const port = (process.env.PORT || 3000) as number,
  io = new Server(port, { cors: { origin: '*' } });

console.log('socket connected to port:', port, process.env.subDomain);

io.on('connection', (socket) => {
  console.log('connected');
});

const re = netlifyHttpService;

export { io };
