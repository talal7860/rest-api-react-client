import * as React from 'react';
import Client from './Client';

const ApiContext = React.createContext({});

export interface Props {
  children: React.ReactNode;
  client: Client;
}

export interface ApiContextInterface {
  data: any;
  setData(data: any): void;
  client: Client,
  requests: any;
  setRequests(requests: any): void;
}

export const ApiProvider = ({ children, client }: Props): React.ReactNode => {
  const [data, setData] = React.useState({});
  const [requests, setRequests] = React.useState({});

  const contextValue: ApiContextInterface = { data, setData, client, requests, setRequests };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
