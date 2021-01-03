import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApiProvider, Client } from 'rest-api-react-client';
import { accessTokenKey } from './constants';


const authroizationHeaders = () => {
  const token = window.sessionStorage.getItem(accessTokenKey);
  if (!token) {
    return {};
  }
  return {
    Authorization: `token ${window.sessionStorage.getItem(accessTokenKey)}`
  };
}

const client = new Client('https://api.github.com', {
  initialHeaders: () => ({
    ...authroizationHeaders(),
    Accept: 'application/vnd.github.v3+json',
    'content-type': 'application/json',
  }),
});

ReactDOM.render(
  <React.StrictMode>
    <ApiProvider client={client}>
      <App />
    </ApiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
