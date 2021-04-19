const { Server } = require('socket.io'),
  { cmdArr } = require('./helpers/cmds'),
  { execPromise, seqExecArr, addDNSRecord } = require('./helpers/utils'),
  { events } = require('./helpers/constants');

const io = new Server(3000);

const sendProg = (socket) => ({ percent, msg }) => {
  socket.broadcast.emit(events.PROGRESS, {
    percent, msg
  });
}

io.on('connection', socket => {
  console.log('connected');
  const pushProg = sendProg(socket);
  socket.on(events.ADD_SUBDOMAIN, async ({ port, subDomain, mainDomain = 'anandkashyap.in' }) => {
    console.log('socket.on -> ADD_SUBDOMAIN')
    pushProg({ percent: 0, msg: 'started registering subdomain' });

    await seqExecArr(cmdArr, pushProg);

    // add domain in netlify
    await addDNSRecord();
    const percent = +(((cmdArr.length + 1) / cmdArr.length + 2) * 100).toFixed(1);
    pushProg({
      percent, msg: 'added dns to netlify'
    });

    await execPromise({ cmd: `certbot --nginx -d $subDomain.$mainDomain`, msg: 'Register SSL' }, pushProg, 100);
  });
  io.emit('test1', 'okkkk');

});

module.exports = { io }