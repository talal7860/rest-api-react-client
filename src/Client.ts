import queryString from 'query-string';
import { merge } from 'lodash/fp';
import { isNetworkError, isJsonHeader } from './util';
import RequestError from './errors/RequestError';

class Client {
  private baseUrl: string;
  private headers: Headers;
  private options: RequestOptions;
  constructor(baseUrl: string, options: RequestOptions) {
    this.baseUrl = baseUrl;
    this.headers = new Headers();
    this.options = {
      ...options,
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    };
    this.response = this.response.bind(this);
    this.request = this.request.bind(this);
  }

  refreshHeaders(json = false): void {
    this.headers = new Headers(merge(this.options.initialHeaders(), this.options.headers));
    if (json) {
      this.headers.append('Accept', 'application/json');
      this.headers.append('Content-Type', 'application/json');
    }
  }

  async request({
    path, query, body, baseUrl, method, json,
  }: RequestOptions): Promise<ClientResponse | RequestError> {
    this.refreshHeaders(json);
    return new Promise((resolve, reject) => {
      const url = queryString.stringifyUrl({
        url: `${baseUrl || this.baseUrl}${path}`,
        query,
      });
      fetch(url, {
        ...this.options,
        method,
        headers: this.headers,
        body: JSON.stringify(body),
      }).then(async (res) => {
        if (isNetworkError(res.status)) {
          reject(new RequestError(await this.response(res)));
        } else {
          resolve(this.response(res));
        }
      }).catch((e) => {
        reject(new RequestError({ data: e.message, status: 500, statusText: 'Internal server error' }));
      });
    });
  }

  async response(res: Response): Promise<ClientResponse> {
    let data = null;
    if (isJsonHeader(this.headers)) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return {
      ...res,
      data,
    };
  }
}

export default Client;
