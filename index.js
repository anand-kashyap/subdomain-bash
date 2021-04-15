const { execPromise, seqExecArr, addDNSRecord } = require('./helpers/utils');
const { cmdArr } = require('./helpers/cmds');

//* run below commands if on nvm
//sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
// sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"

(async () => {
  const { mainDomain } = process.env;
  // console.log('mainDomain', mainDomain)

  await seqExecArr(cmdArr.slice(0, 1));

  // add domain in netlify
  // await addDNSRecord();

  // await execPromise({ cmd: `certbot --nginx -d $subDomain.$mainDomain`, msg: 'Register SSL' })

})();
