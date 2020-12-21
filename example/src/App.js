import { usePost, useLazyGet } from 'rest-api-react-client';
import { isEmpty } from 'lodash/fp';
import queryString from 'query-string';
import './App.css';
import { useState, useEffect } from 'react';
import { accessTokenKey, callbackUrl, perPage } from './constants';

const App = () => {
  const [params, setParams] = useState({
    clientId: window.sessionStorage.getItem('clientId') || '',
    clientSecret: window.sessionStorage.getItem('clientSecret') || '',
  });
  const githubAccessToken = window.sessionStorage.getItem(accessTokenKey);
  const onChange = (e) => {
    e.preventDefault();
    window.sessionStorage.setItem(e.target.name, e.target.value);
    setParams({
      ...params,
      [e.target.name]: e.target.value,
    });
  };
  const [page, setPage] = useState(1);

  const onNext = () => {
    setPage(page + 1);
  }

  const onPrevious = () => {
    setPage(page - 1);
  }

  const [getAccessToken, { loading }] = usePost('/github_access_token', {
    json: true,
    baseUrl: process.env.ACCESS_TOKEN_EXCHANGE_SERVER,
    onCompleted(res) {
      if (res.access_token) {
        window.sessionStorage.setItem(accessTokenKey, res.access_token);
      }
      window.location.href = window.location.pathname.replace('callback', '');
    },
    onError(err) {
      alert(err.data);
      window.location.href = window.location.pathname.replace('callback', '');
    }
  });

  const [fetchRepos, { loading: reposLoading, data: userRepos }] = useLazyGet('/user/repos', {
    json: true,
    query: {
      per_page: perPage,
    },
    onError(err) {
      alert(err.data)
      if (err.status === 401) {
        window.sessionStorage.clear();
        window.location.reload();
      }
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    window.location.href = queryString.stringifyUrl({
      url: 'https://github.com/login/oauth/authorize',
      query: {
        client_id: params.clientId,
        scope: 'user,repo'
      }
    });
  }

  useEffect(() => {
    if (window.location.pathname.includes('/callback')) {
      const callbackCode = queryString.parse(window.location.search).code;
      if (callbackCode) {
        getAccessToken({
          params: {
            client_id: window.sessionStorage.getItem('clientId'),
            client_secret: window.sessionStorage.getItem('clientSecret'),
            code: callbackCode,
            redirect_uri: callbackUrl,
          }
        })
      }
    }
  }, []);

  useEffect(() => {
    if (window.sessionStorage.getItem(accessTokenKey)) {
      fetchRepos({ query: { page } });
    }
  }, [page]);

  return (
    <div className="App">
      <h1>Repositories List</h1>
      {loading || reposLoading ? 'Loading...' : null}
      {
        githubAccessToken ? (
          <>
            <div>
              {(userRepos || []).map((repo) => (<div key={repo.id}>Repo Name: {repo.name}</div>))}
            </div>
            <button disabled={reposLoading || page === 1} onClick={onPrevious}>Previous</button>
            <button disabled={isEmpty(userRepos) || reposLoading} onClick={onNext}>Next</button>
          </>
        ): (
          <form onSubmit={onSubmit} method="post">
            <legend>Github Credentials</legend>
            <fieldset>
              <label htmlFor="clientId">Client ID</label>
              <input required id="clientId" name="clientId" onChange={onChange} type="text" value={params.clientId} />
            </fieldset>
            <fieldset>
              <label htmlFor="clientSecret">Client Secret</label>
              <input required id="clientSecret" name="clientSecret" type="password" onChange={onChange} value={params.clientSecret} />
            </fieldset>
            <input type="submit" value="Authroize Github" />
          </form>
        )
      }
    </div>
  );
}

export default App;
