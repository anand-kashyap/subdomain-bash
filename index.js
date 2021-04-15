require('dotenv').config();

const { execPromise, seqExecArr, addDNSRecord } = require('./helpers/utils');
const { cmdArr } = require('./helpers/allSeqs');

(async () => {
  await seqExecArr(cmdArr);

  // add domain in netlify
  await addDNSRecord();

  await execPromise({ cmd: `certbot --nginx -d $subDomain.$mainDomain`, msg: 'Register SSL' })

})();
