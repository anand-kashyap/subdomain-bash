import { Common } from '.';
import { netlifyHttpService } from '../services/netlifyAxios';
import { NetlifyDNSRecord, NetlifyDNSZone } from './types';
const { mainDomain, DROPLET_IP } = process.env;

class NetlifyAPI {
  private subDomain: string;
  private subdomainFullUrl: string;

  constructor(subDomain?: string, private apiClient = netlifyHttpService()) {
    if (!subDomain && !process.env.dev) {
      throw new Error('subdomain must be passed');
    }
    if (!subDomain && process.env.dev) {
      this.subDomain = Common.getEnvVariable('subDomain');
    }

    this.subDomain = subDomain as string;
    this.subdomainFullUrl = `${this.subDomain}.${mainDomain}`;
  }

  async getDNSZone(mainDomain: string) {
    const dnsList = await this.apiClient.get<any, NetlifyDNSZone[]>(
      '/dns_zones'
    );
    const dnsZone = dnsList.find((dns) => dns.name === mainDomain);
    if (!dnsZone?.id) throw new Error(`site: ${mainDomain} not found in DNS`);

    return dnsZone;
  }

  async validateSubdomainRecord(dnsZoneId: string) {
    // check in existing DNS records
    const dnsRecs = await this.apiClient.get<any, NetlifyDNSRecord[]>(
      `/dns_zones/${dnsZoneId}/dns_records`
    );
    for (const rec of dnsRecs) {
      if (rec.hostname === this.subdomainFullUrl) {
        throw new Error(
          `${this.subdomainFullUrl} record already present in DNS records`
        );
      }
    }
  }

  async addDNSRecordByDNSZoneId(dnsZoneId: string) {
    const newRec = {
      hostname: this.subdomainFullUrl,
      type: 'A',
      dns_zone_id: dnsZoneId,
      value: DROPLET_IP,
    };
    const addedRec = await this.apiClient.post<any, NetlifyDNSRecord>(
      `/dns_zones/${dnsZoneId}/dns_records`,
      newRec
    );
    console.info(
      `${this.subdomainFullUrl} added successfully with id: ${addedRec.id}`
    );
  }
}

const createInstance = (subdomain?: string) => new NetlifyAPI(subdomain);

export { createInstance };
