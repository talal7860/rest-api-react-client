import { useEffect, useState } from 'react';
import {
  get, isEmpty, merge, getOr, omitBy, isUndefined,
} from 'lodash/fp';
import useApiClient from './useApiClient';
import { cacheKey, canUseCache } from '../util';
import NETWORK_STATUS from '../constants/networkStatus';
import RequestError from '../errors/RequestError';

const getParams = getOr({}, 'params');
const getQuery = getOr({}, 'query');
const getHeaders = getOr({}, 'headers');
const omitUndefined = omitBy(isUndefined);

const useRequestHandler = (path, requestOptions = {}) => {
  const {
    data, setData, client,
  } = useApiClient();
  const [networkStatus, setNetworkStatus] = useState(NETWORK_STATUS.initial);
  const [options, setOptions] = useState(requestOptions);
  const [loading, setLoading] = useState(options.loading || false);
  const [error, setError] = useState(null);
  const [resData, setResData] = useState();

  const key = cacheKey(path, options);
  const cacheData = get(key)(data);
  const response = resData || cacheData;

  const request = async () => {
    if (canUseCache(options) && !isEmpty(cacheData)) {
      return;
    }
    setNetworkStatus(NETWORK_STATUS.started);
    setLoading(true);
    try {
      const res = await client.request(options);
      setData({ [key]: res.data });
    } catch (e) {
      if (e instanceof RequestError) {
        setError(e.parsedMessage());
      } else {
        setError(e.message);
      }
    }
    setLoading(false);
    setNetworkStatus(NETWORK_STATUS.completed);
  };

  useEffect(() => {
    if (loading) {
      setLoading(false);
      if (options.onCompleted && cacheData) {
        options.onCompleted(cacheData);
      }
    } else if (canUseCache(options) && !isEmpty(cacheData) && options.onCompleted) {
      options.onCompleted(cacheData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheData]);

  useEffect(() => {
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

  const fetch = (fetchOptions) => {
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
  const fetchMore = async ({ query, updateQuery }) => {
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
