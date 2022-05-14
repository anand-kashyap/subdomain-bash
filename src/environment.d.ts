declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: number;
      dev: boolean;
      port?: number; // api to deploy port
      subDomain?: string;
      mainDomain: string;
      NETLIFY_TOKEN: string;
      DROPLET_IP: string;
      WEB_DIR: string;
    }
  }
}

// If this file has no import/deexport statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
