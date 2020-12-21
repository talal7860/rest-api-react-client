# rest-api-react-client

> Rest api react client for functional react components

[![NPM](https://img.shields.io/npm/v/rest-api-react-client.svg)](https://www.npmjs.com/package/rest-api-react-client) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add rest-api-react-client
```

## Usage

```jsx
import React, { Component } from 'react';

import { useGet, ApiProvider } from 'rest-api-react-client';

const client = new Client('http://api-url', {
  headers: () => ({
    Authorization: 'token 123',
    'content-type': 'application/json',
  }),
});

ReactDOM.render(
  <React.StrictMode>
    <ApiProvider client={client}>
      <Example />
    </ApiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

const Example = () => {
  const { data, loading, error } = useGet('/movies-list', {
    query: { page: 1 },
  });

  if (loading) {
    return 'Loading...';
  }

  if (error) {
    return <div class="error">Something went wrong: {error.data}</div>;
  }
  return (
    <div>
      {data.map((movie) => (<div>{movie.title}</div>))}
    </div>
  );
}


```

### Exposed Hooks
------
- `useGet`
- `useLazyGet`
- `usePost`
- `useDelete`
- `usePut`


### Paramaters
------

#### **Return Paramaters**

| Name   | Description | Returned By | 
|----------|:-------------|---------|
| fetch | method to trigger the call | `usePost`, `useDelete`, `usePut`, `useLazyGet` |
| options (object) | data, loading, error (details below) | all |

---

##### Options
| Name   | Description | Returned By | 
|----------|:-------------|---------|
| data |  Response from the server | all |
| loading |    `true` if the request is progress, `false` otherwise   | all |
| error | If there is any error, this should be set | all |
----


#### **Arguments**
---


| Name   | Description | Required | 
|----------|:-------------|---------|
| path |  Path to your resource | Yes |
| options |  onCompleted, onError, params, query, json, headers, baseUrl | No |

----
##### Options
| Name   | Description | Required | 
|----------|:-------------|---------|
| params |  Parameters to send to be send as part of body | No |
| query |  Query paramaters that will be attached to the url | No |
| onCompleted |  Callback triggered when the request is complete | No |
| onError |  Callback triggered when there is an error | No |
| json |  `true` of `false` in case you want to attach `Accept: application/json` headers to the request | No |
| headers |  Array of extra headers required only in this request | No |
| baseUrl |  In case you want a different base url for this request | No |

----


**Difference between hooks with examples**

```jsx
const [post, { data, error, loading }] = usePost('/user/1');

const onSubmit = () => {
  post({ params: { name, email, password } });
}


const [put, { data, error, loading }] = usePut('/user/1');

const onSubmit = () => {
  put({ params: { name, email, password } });
}

const [deleteUser, { data, error, loading }] = useDelete('/user/1');

const onClick = () => deleteUser();

const [fetchUser, { data, error, loading }] = useLazyGet('/users');

const onClick = () => fetchUser({ query: { page } });

const { data, error, loading } = useGet('/current_user');

return <div>data.name</div>;
```

## License

MIT © [talal7860](https://github.com/talal7860)
