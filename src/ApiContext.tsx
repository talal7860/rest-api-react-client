import * as React from 'react';
import Client from './Client';

const ApiContext = React.createContext({});

export interface Props {
  children: React.ReactNode;
  client: Client;
}

export interface ApiContextInterface {
  value: any;
  setValue(data: any): void;
  client: Client,
}

export const ApiProvider = ({ children, client }: Props): React.ReactNode => {
  const [value, setValue] = React.useState({});

  const contextValue: ApiContextInterface = { value, setValue, client };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
