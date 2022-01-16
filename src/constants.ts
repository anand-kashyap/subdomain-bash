const envVarNames = [
  'appName',
  'port',
  'subDomain',
  'mainDomain',
  'NETLIFY_TOKEN',
  'DROPLET_IP',
];

enum CustomEvents {
  ADD_SUBDOMAIN = 'add_subdomain',
  PROGRESS = 'progress',
}

enum SequenceCustomEvent {
  ADD_DNS_RECORD,
}
export { CustomEvents, envVarNames, SequenceCustomEvent };
