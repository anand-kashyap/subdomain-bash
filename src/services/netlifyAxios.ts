import axios, { AxiosRequestConfig } from 'axios';

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
 * @param errClass Pass Optional Error class
 */
const netlifyHttpService = (errClass?: any) => {
  const axiosInstance = createInstance();

  axiosInstance.interceptors.response.use(
    (v) => v,
    (error) => {
      if (errClass) throw new errClass(error);
      throw new errClass(error);
    }
  );
  return axiosInstance;
};
export { netlifyHttpService };
