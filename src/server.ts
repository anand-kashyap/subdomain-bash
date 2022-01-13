import { Server } from 'socket.io';

const port = (process.env.PORT || 3000) as number,
  io = new Server(port, { cors: { origin: '*' } });

console.log('socket connected to port:', port);

io.on('connection', (socket) => {
  console.log('connected');
});

export { io };
