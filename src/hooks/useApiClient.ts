import { useContext, useEffect } from 'react';
import { merge, omitBy, isUndefined } from 'lodash/fp';
import ApiContext, { ApiContextInterface } from '../ApiContext';
import Client from '../Client';
import { cacheKey } from '../util';

const omitUndefined = omitBy(isUndefined);

export interface ApiClient {
  data: ApiBody;
  resetData(): void;
  writeData(path: string, options: WriteDataOptions): void;
  setData(data: ApiData): void;
  client: Client,
  cacheKey(options: CacheOptions): string;
}

const useApiClient = () : ApiClient => {
  const { value, setValue, client } = useContext(ApiContext) as ApiContextInterface;
  const setData = (data: ApiData) => setValue(merge(value)(data));

  useEffect(() => {
    if (!client) {
      throw new Error('Client not set, make sure the hooks are called insider the provider');
    }
  }, [client]);

  const resetData = () => setValue({});

  const writeData = (path: string, { query, data, method }: WriteDataOptions) => {
    const key = cacheKey(omitUndefined({ query, method, path }));
    setData({ [key]: data });
  };

  return {
    data: value,
    cacheKey,
    setData,
    resetData,
    writeData,
    client,
  };
};

export default useApiClient;