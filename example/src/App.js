import { usePost } from 'rest-api-react-client';
import queryString from 'query-string';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import { useState, useEffect, lazy, Suspense } from 'react';
import { accessTokenKey, callbackUrl } from './constants';
import Navigation from './components/Navigation';
const ReposWithLazyGet = lazy(() => import('./pages/ReposWithLazyGet'));
const ReposWithNetworkPolicy = lazy(() => import('./pages/ReposWithNetworkPolicy'));
const ReposWithCache = lazy(() => import('./pages/ReposWithCache'));
const ReposWithWallFeed = lazy(() => import('./pages/ReposWithWallFeed'));

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

  const [getAccessToken, { loading }] = usePost('/github_access_token', {
    json: true,
    baseUrl: process.env.REACT_APP_ACCESS_TOKEN_EXCHANGE_SERVER,
    onCompleted(res) {
      if (res.access_token) {
        window.sessionStorage.setItem(accessTokenKey, res.access_token);
      }
      // window.location.href = window.location.pathname.replace('callback', '');
    },
    onError(err) {
      alert(err.data);
      // window.location.href = window.location.pathname.replace('callback', '');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <div className="App">
        <h1>Repositories List</h1>
        {loading ? 'Loading...' : null}
        {
          githubAccessToken ? ( 
            <>
              <Navigation />
              <Switch>
                <Route path="/wall-feed">
                  <Suspense fallback={<div>Loading...</div>}>
                    <ReposWithWallFeed />
                  </Suspense>
                </Route>
                <Route path="/network-policy">
                  <Suspense fallback={<div>Loading...</div>}>
                    <ReposWithNetworkPolicy />
                  </Suspense>
                </Route>
                <Route path="/cache-policy">
                  <Suspense fallback={<div>Loading...</div>}>
                    <ReposWithCache />
                  </Suspense>
                </Route>
                <Route path="/">
                  <Suspense fallback={<div>Loading...</div>}>
                    <ReposWithLazyGet />
                  </Suspense>
                </Route>
              </Switch>
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
    </Router>
  );
}

export default App;
