import axios, { AxiosRequestConfig } from 'axios';
import { Common } from '../utils';
const [subDomain, mainDomain, DROPLET_IP, NETLIFY_TOKEN] =
  Common.getEnvVariable(
    'subDomain',
    'mainDomain',
    'DROPLET_IP',
    'NETLIFY_TOKEN'
  );

const config: AxiosRequestConfig = {
  baseURL: 'https://api.netlify.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${NETLIFY_TOKEN}`,
  },
};
const netlifyHttpService = axios.create(config);

export { netlifyHttpService };
