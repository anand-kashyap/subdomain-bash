import { netlifyHttpService } from '../services/netlifyAxios';
import { NetlifyDNSRecord, NetlifyDNSZone } from '../types';
const { DROPLET_IP } = process.env;

class NetlifyAPI {
  private subDomain = '';
  private mainDomain = '';
  private subdomainFullUrl = '';
  private apiClient = netlifyHttpService();

  constructor() {}

  async getDNSZone() {
    const dnsList = await this.apiClient.get<any, NetlifyDNSZone[]>(
      '/dns_zones'
    );
    const dnsZone = dnsList.find((dns) => dns.name === this.mainDomain);
    if (!dnsZone?.id)
      throw new Error(`site: ${this.mainDomain} not found in DNS`);

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

  async addDNSRecord() {
    if (process.env.dev) return console.log('added DNS [dev mode]');

    const { mainDomain, subDomain } = process.env;
    if (!subDomain) {
      throw new Error('subdomain must be passed');
    }

    this.subDomain = subDomain as string;
    this.mainDomain = mainDomain as string;
    this.subdomainFullUrl = `${this.subDomain}.${this.mainDomain}`;

    const dnsZone = await this.getDNSZone();
    await this.validateSubdomainRecord(dnsZone.id);
    await this.addDNSRecordByDNSZoneId(dnsZone.id);
  }
}

const netlifyClientCreator = () => new NetlifyAPI();

export { NetlifyAPI, netlifyClientCreator };
