import { useEffect, useState } from 'react';
import {
  get, isEmpty, merge, omitBy, isUndefined,
} from 'lodash/fp';
import useApiClient from './useApiClient';
import { cacheKey, canUseCache } from '../util';
import RequestError from '../errors/RequestError';
import NetworkStatus from '../constants/networkStatus';

const getParams = get('params');
const getQuery = get('query');
const getHeaders = get('headers');
const omitUndefined = omitBy(isUndefined);

const useRequestHandler = (path: string, requestOptions: RequestOptions = {}): [any, ApiResponseOptions] => {
  const {
    data, setData, client, setRequests, requests,
  } = useApiClient();
  const [networkStatus, setNetworkStatus] = useState(NetworkStatus.Initial);
  const [options, setOptions] = useState(requestOptions);
  const [loading, setLoading] = useState(options.loading || false);
  const [error, setError] = useState<ClientResponse | undefined>();
  const [resData, setResData] = useState();

  const key = cacheKey(options);
  const cacheData = get(key)(data);
  const response = resData || cacheData;
  const requestInProgress = get(key)(requests);

  const request = async () => {
    if (canUseCache(options) && !isEmpty(cacheData)) {
      return;
    }
    setNetworkStatus(NetworkStatus.Started);
    setLoading(true);
    try {
      if (requestInProgress) {
        return;
      }
      setRequests({ [key]: true });
      const res = await client.request(options);
      setData({ [key]: res.data });
    } catch (e) {
      if (e instanceof RequestError) {
        setError(e.response());
      } else {
        setError({ status: 500, statusText: 'Internal Server Error', data: e.message });
      }
    }
  };

  useEffect(() => {
    if (!cacheData) { return; }
    if (loading || requestInProgress) {
      setLoading(false);
      setRequests({ [key]: false });
      setNetworkStatus(NetworkStatus.Completed);
      if (options.onCompleted) {
        options.onCompleted(cacheData);
      }
    } else if (canUseCache(options) && options.onCompleted) {
      options.onCompleted(cacheData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheData]);

  useEffect(() => {
    setLoading(false);
    if (error && options.onError) {
      options.onError(error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (options !== requestOptions) {
      request();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const fetch = (fetchOptions: RequestOptions) => {
    const mergedOptions = merge(options, fetchOptions);
    setOptions(omitUndefined({
      ...options,
      path,
      headers: getHeaders(fetchOptions),
      query: getQuery(mergedOptions),
      body: getParams(mergedOptions),
    }));
  };
  /**
   * Fetch more is used for pagination
   * Pagination can be cursor based or offset limit based
   * All depends on the paramaters passed in query
   * updateQuery is to be implemented by the requester
   * The first argument of the updateQuery is the original data in cache,
   * key for that data depends on the requestOptions, the options set when the request was made
   * Any data that is returned by updateQuery will be set in the cache for the original key
   * @param {Object} options
   * query: Object
   * updateQuery: function
   */
  const fetchMore = async ({ query, updateQuery }: FetchMore) => {
    if (options.method !== 'GET') {
      return;
    }
    if (updateQuery) {
      const opts = merge(options)({ query });
      const newData = get(cacheKey(opts))(data);
      const updateQueryResult = async () => {
        if (canUseCache(opts) && !isEmpty(newData)) {
          return { fetchMoreResult: newData, error: null };
        }
        try {
          setLoading(true);
          const res = await client.request(opts);
          setData({ [cacheKey(opts)]: res.data });
          return { fetchMoreResult: res.data, error: null };
        } catch (e) {
          return { fetchMoreResult: null, error: e.message };
        }
      };
      setLoading(true);
      const updatedResponse = await updateQueryResult();
      setResData(updateQuery(response, updatedResponse));
      setLoading(false);
    }
  };

  return [fetch, {
    data: response,
    loading,
    error,
    networkStatus,
    fetchMore,
  }];
};

export default useRequestHandler;
