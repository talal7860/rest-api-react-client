import queryString from 'query-string';
import { getOr } from 'lodash/fp';
import { isNetworkError } from './util';
import RequestError from './errors/RequestError';

const JSON_ACCEPT_HEADERS = Object.freeze([
  'application/json',
  'application/vnd.github.v3+json',
]);

class Client {
  constructor(baseUrl, options) {
    this.baseUrl = baseUrl;
    this.headers = options.headers;
    this.options = {
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    };
    this.response = this.response.bind(this);
    this.request = this.request.bind(this);
  }

  getHeaders(json = false) {
    const headers = this.headers();
    if (json) {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      };
    }
    return headers;
  }

  async request({
    path, query, body, json, baseUrl, method,
  }) {
    return new Promise((resolve, reject) => {
      const url = queryString.stringifyUrl({
        url: `${baseUrl || this.baseUrl}${path}`,
        query,
      });
      fetch(url, {
        ...this.options,
        method,
        headers: this.getHeaders(json),
        body: JSON.stringify(body),
      }).then((res) => {
        if (isNetworkError(res.status)) {
          reject(new RequestError(this.response(res)));
        } else {
          resolve(this.response(res));
        }
      }).catch((e) => {
        reject(new RequestError({ data: e.message, status: 500, statusText: 'Internal server error' }));
      });
    });
  }

  async response(res) {
    const acceptType = getOr('', 'Accept', this.getHeaders());
    let data = null;
    if (JSON_ACCEPT_HEADERS.includes(acceptType)) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return {
      status: res.status,
      statusText: res.statusText,
      data,
    };
  }
}

export default Client;
