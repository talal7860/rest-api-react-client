import { ApiProvider, Client } from 'rest-api-react-client';
import logo from './logo.svg';
import './App.css';

const client = new Client(process.env.REACT_APP_API_URL, {
  headers: () => ({
    Authorization: `Authorization: token ${process.env.REACT_APP_OUATH_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'content-type': 'application/json',
  }),
});

function App() {
  return (
    <ApiProvider client={client}>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    </ApiProvider>
  );
}

export default App;
