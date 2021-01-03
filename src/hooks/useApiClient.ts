import { useContext, useEffect } from 'react';
import { merge, omitBy, isUndefined } from 'lodash/fp';
import ApiContext, { ApiContextInterface } from '../ApiContext';
import Client from '../Client';
import { cacheKey } from '../util';

const omitUndefined = omitBy(isUndefined);

export interface ApiClient {
  data: ApiBody;
  requests: any;
  resetData(): void;
  writeData(path: string, options: WriteDataOptions): void;
  setData(data: ApiData): void;
  client: Client,
  cacheKey(options: CacheOptions): string;
  setRequests: any;
}

const useApiClient = () : ApiClient => {
  const context = useContext(ApiContext) as ApiContextInterface;
  const setData = (data: ApiData) => context.setData(merge(context.data)(data));
  const setRequests = (requests: any) => context.setRequests(merge(context.requests)(requests))

  useEffect(() => {
    if (!context.client) {
      throw new Error('Client not set, make sure the hooks are called insider the provider');
    }
  }, [context.client]);

  const resetData = () => {
    context.setData({});
    context.setRequests({})
  };

  const writeData = (path: string, { query, data, method }: WriteDataOptions) => {
    const key = cacheKey(omitUndefined({ query, method, path }));
    setData({ [key]: data });
  };

  return {
    data: context.data,
    requests: context.requests,
    cacheKey,
    setData,
    resetData,
    writeData,
    setRequests,
    client: context.client,
  };
};

export default useApiClient;
