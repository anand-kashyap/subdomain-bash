const envVarNames = ['mainDomain', 'NETLIFY_TOKEN', 'DROPLET_IP']; // port,subdomain are optional

enum CustomEvents {
  ADD_SUBDOMAIN = 'add_subdomain',
  PROGRESS = 'progress',
}

export { CustomEvents, envVarNames };
