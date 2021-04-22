const { execSync } = require('child_process');
const axios = require('axios').default;
const { subDomain, mainDomain, DROPLET_IP, NETLIFY_TOKEN } = process.env;
const { events } = require('./constants');

axios.defaults = {
  baseURL: 'https://api.netlify.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${NETLIFY_TOKEN}`
  }
};

const execPromise = ({ cmd, msg }, pushProg, percent) => {
  return new Promise((res, rej) => {
    // todo - send started to socket
    if (msg) console.log(msg + ' started');
    if (process.env.dev) {
      pushProg({
        percent, msg
      });

      return res(msg)
    };
    try {
      const dat = execSync(cmd, { shell: true });
      res(dat.toString());
      pushProg({
        percent, msg
      });
    } catch (er) {
      // todo - send error to socket
      rej(er);
    }
  })
};

const seqExecArr = async (cmdArr, pushProg) => {
  const total = cmdArr.length + 2;

  for (let i = 0; i < cmdArr.length; i++) {
    const cmdObj = cmdArr[i];
    console.log({ total, index: i + 1 });
    const percent = (((i + 1) / total) * 100);
    await execPromise(cmdObj, pushProg, percent);
  }
}

const addDNSRecord = async () => {
  if (process.env.dev) return console.log('added DNS [dev mode]');
  // get DNS zone id
  const dnsList = await axios.get('/dns_zones');

  let dnsZoneId = '';
  for (const dns of dnsList) {
    if (dns.name === mainDomain) {
      dnsZoneId = dns.id;
      break;
    }
  }
  if (!dnsZoneId) {
    return console.error(`site: ${mainDomain} not found in DNS`);
  }

  // check in existing DNS records
  const dnsRecs = await axios.get(`/dns_zones/${dnsZoneId}/dns_records`);
  // console.log('addDNSRecord -> dnsRecs', dnsRecs)
  const sName = subDomain + '.' + mainDomain;
  for (const rec of dnsRecs) {
    if (rec.hostname === sName) {
      return console.error(`${sName} record already present in DNS records`);
    }
  }

  // add DNS record
  const newRec = {
    hostname: sName,
    type: 'A',
    dns_zone_id: dnsZoneId,
    value: DROPLET_IP
  };
  const addedRec = await axios.post(`/dns_zones/${dnsZoneId}/dns_records`, newRec);
  return console.info(`${sName} added successfully with id: ${addedRec.id}`);
};
module.exports = { execPromise, seqExecArr, addDNSRecord };