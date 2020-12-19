import queryString from 'query-string';

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
  }

  async get({
    path, query, json,
  }) {
    const url = queryString.stringifyUrl({
      url: `${this.baseUrl}${path}`,
      query,
    });
    const res = await fetch(url, {
      ...this.options,
      headers: this.headers(),
    }).then((result) => {
      if (json) {
        return Client.jsonResponse(result);
      }
      return res;
    })
      .catch((e) => ({ data: { errors: [e.message] } }));
    return res;
  }

  async post({
    path, body, json, headers,
  }) {
    const stringifiedUrl = `${this.baseUrl}/${path}`;
    const res = await fetch(stringifiedUrl, {
      ...this.options,
      headers: {
        ...this.headers(),
        ...headers,
      },
      method: 'POST',
      body: JSON.stringify(body),
    }).then((result) => {
      if (json) {
        return Client.jsonResponse(result);
      }
      return res;
    })
      .catch((e) => ({ data: { errors: [e.message] } }));
    return res;
  }

  static async jsonResponse(res) {
    const data = await res.json();
    return {
      status: res.status,
      statusText: res.statusText,
      data,
    };
  }
}

export default Client;
