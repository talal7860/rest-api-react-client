import { useContext } from 'react';
import ApiContext from '../contexts';

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
