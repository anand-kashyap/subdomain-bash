import axios, { AxiosRequestConfig } from 'axios';

const netlifyHttpService = () => {
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

export { netlifyHttpService };
