import { useContext, useEffect } from 'react';
import ApiContext from '../ApiContext';

const useApiClient = () => {
  const { value, setValue, client } = useContext(ApiContext);
  const setData = (data) => {
    setValue({
      ...value,
      ...data,
    });
  };

  const cacheKey = (path, { params, method }) => JSON.stringify({
    path,
    params,
    method,
  });

  useEffect(() => {
    if (!client) {
      throw new Error('Client not set, make sure the hooks are called insider the provider');
    }
  }, [client]);

  const resetData = () => setValue({});

  const writeData = (path, { params, data, method }) => {
    const key = cacheKey(path, { params, method });
    setData({ [key]: data });
  };

  return {
    data: value,
    cacheKey,
    setData,
    resetData,
    writeData,
    fetchClient: client,
  };
};

export default useApiClient;
