import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Client from '../Client';

const ApiContext = React.createContext({});

export const ApiProvider = ({ children, client }) => {
  const [value, setValue] = useState({});

  return (
    <ApiContext.Provider value={{ value, setValue, client }}>
      {children}
    </ApiContext.Provider>
  );
};

ApiProvider.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any.isRequired,
  client: PropTypes.instanceOf(Client).isRequired,
};
export default ApiContext;
