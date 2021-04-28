const { Server } = require('socket.io'),
  { cmdArr } = require('./helpers/cmds'),
  { execPromise, seqExecArr, addDNSRecord, sendProg, mapArgtoEnv } = require('./helpers/utils'),
  { events } = require('./helpers/constants');

const port = process.env.PORT || 3000,
  io = new Server(port, { cors: true });

console.log('socket connected to port:', port);

io.on('connection', socket => {
  console.log('connected');
  const pushProg = sendProg(socket);

  socket.on(events.ADD_SUBDOMAIN, async ({ port, subDomain, mainDomain = 'anandkashyap.in', appName }) => {
    mapArgtoEnv({ port, subDomain, mainDomain, appName });

    console.log('socket.on -> ADD_SUBDOMAIN')
    pushProg({ percent: 0, msg: `started registering ${subDomain} subdomain` });

    await seqExecArr(cmdArr, pushProg);

    // add domain in netlify
    await addDNSRecord();
    const currentPos = cmdArr.length + 1, total = cmdArr.length + 2,
      percent = ((currentPos / total) * 100);

    pushProg({ percent, msg: 'added dns to netlify' });

    await execPromise({ cmd: `certbot --nginx -d $subDomain.$mainDomain`, msg: 'Register SSL' }, pushProg, 100);
  });

});

module.exports = { io }