const { Server } = require('socket.io'),
  { cmdArr } = require('./helpers/cmds'),
  { execPromise, seqExecArr, addDNSRecord } = require('./helpers/utils'),
  { events } = require('./helpers/constants');

const port = process.env.PORT || 3000,
  io = new Server(port);

console.log('socket connected to port:', port);
const sendProg = (socket) => ({ percent, msg }) => {
  console.log('pushprog call', { percent, msg });
  socket.emit(events.PROGRESS, {
    percent, msg
  });
}

io.on('connection', socket => {
  console.log('connected');
  socket.on(events.ADD_SUBDOMAIN, async ({ port, subDomain, mainDomain = 'anandkashyap.in' }) => {
    const pushProg = sendProg(socket);
    console.log('socket.on -> ADD_SUBDOMAIN')
    pushProg({ percent: 0, msg: 'started registering subdomain' });

    await seqExecArr(cmdArr, pushProg);

    // add domain in netlify
    await addDNSRecord();
    const currentPos = cmdArr.length + 1, total = cmdArr.length + 2,
      percent = ((currentPos / total) * 100);
    pushProg({
      percent, msg: 'added dns to netlify'
    });

    await execPromise({ cmd: `certbot --nginx -d $subDomain.$mainDomain`, msg: 'Register SSL' }, pushProg, 100);
  });

});

module.exports = { io }