import axios, { AxiosRequestConfig } from 'axios';
import { NetlifyAPIError } from '../errors/api';

const createInstance = () => {
  const { NETLIFY_TOKEN } = process.env;
  const config: AxiosRequestConfig = {
    baseURL: 'https://api.netlify.com/api/v1',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NETLIFY_TOKEN}`,
    },
  };

  return axios.create(config);
};

/**
 * Create netlify axios instance
 */
const netlifyHttpService = () => {
  const axiosInstance = createInstance();

  axiosInstance.interceptors.response.use(
    (v) => v,
    (error) => {
      throw new NetlifyAPIError(error);
    }
  );
  return axiosInstance;
};
export { netlifyHttpService };
