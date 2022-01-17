import { AxiosError } from 'axios';

class NetlifyAPIError extends Error {
  constructor(err: AxiosError) {
    const statusCode = err.response?.status || 500,
      msg = `Netlify Error - ${statusCode}: ${err.message}`;

    super(msg);

    Object.setPrototypeOf(this, NetlifyAPIError);
  }
}

export { NetlifyAPIError };
