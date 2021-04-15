const { spawn, execSync } = require('child_process');

const execPromise = ({ cmd, msg }) => {
  return new Promise((res, rej) => {
    // todo - send started to socket
    if (msg) console.log(msg + ' started');
    try {
      const dat = execSync(cmd);
      // todo - send success to socket
      res(dat.toString());
    } catch (er) {
      // todo - send error to socket
      rej(er);
    }
  })
};

const seqExecArr = async (cmdArr) => {
  for (const cmdObj of cmdArr) {
    await execPromise(cmdObj);
  }
}

module.exports = { execPromise, seqExecArr };