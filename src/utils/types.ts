type NetlifyDNSZone = {
  id: string;
  name: string;
};
type NetlifyDNSRecord = {
  id: string;
  hostname: string;
};

export { NetlifyDNSRecord, NetlifyDNSZone };
