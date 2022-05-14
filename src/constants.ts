const envVarNames = ['appName', 'subDomain', 'mainDomain', 'NETLIFY_TOKEN', 'DROPLET_IP', 'WEB_DIR'];

enum CustomEvents {
  ADD_SUBDOMAIN = 'add_subdomain',
  PROGRESS = 'progress',
  PROCESS_STARTED = 'process_started',
}

enum SequenceCustomEvent {
  ADD_DNS_RECORD,
}
export { CustomEvents, envVarNames, SequenceCustomEvent };
