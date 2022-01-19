import { AxiosError } from 'axios';
import { BaseError } from '../base';

class NetlifyAPIError extends BaseError {
  constructor(err: AxiosError) {
    console.error(err);
    const statusCode = err.response?.status || 500,
      msg = `Netlify Error - ${statusCode}: ${err.message}`;

    super(msg);

    Object.setPrototypeOf(this, NetlifyAPIError);
  }
}

export { NetlifyAPIError };
