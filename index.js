const { execPromise, seqExecArr, addDNSRecord } = require('./helpers/utils');
const { cmdArr } = require('./helpers/allSeqs');

(async () => {
  // const { mainDomain } = process.env;
  // console.log('mainDomain', mainDomain)

  await seqExecArr(cmdArr.slice(0, 1));

  // add domain in netlify
  // await addDNSRecord();

  // await execPromise({ cmd: `certbot --nginx -d $subDomain.$mainDomain`, msg: 'Register SSL' })

})();
