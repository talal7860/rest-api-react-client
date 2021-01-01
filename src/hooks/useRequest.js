import {
  getOr, merge, isEmpty, get,
} from 'lodash/fp';
import { useState } from 'react';
import { isNetworkError, cacheKey, canUseCache } from '../util';
import useRequestHandler from './useRequestHandler';
import useApiClient from './useApiClient';

const getParams = getOr({}, 'params');
const getQuery = getOr({}, 'query');
const getHeaders = getOr({}, 'headers');

const useRequest = (path, requestOptions = {}) => {
  const {
    data,
    setOptions,
    options,
    loading,
    error,
    networkStatus,
    setLoading,
  } = useRequestHandler(path, requestOptions);
  const [resData, setResData] = useState();

  const {
    data: allData, client, setData,
  } = useApiClient();
  const responseData = resData || data;

  const fetch = (fetchOptions) => {
    const mergedOptions = merge(options, fetchOptions);
    const newOptions = {
      ...options,
      path,
      headers: getHeaders(fetchOptions),
    };
    if (!isEmpty(getQuery(mergedOptions))) {
      newOptions.query = getQuery(mergedOptions);
    }
    if (!isEmpty(getParams(mergedOptions))) {
      newOptions.body = getParams(mergedOptions);
    }
    setOptions(newOptions);
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
      const cacheData = get(cacheKey(opts))(allData);
      const updateQueryResult = async () => {
        if (canUseCache(opts) && !isEmpty(cacheData)) {
          return updateQuery(responseData, { fetchMoreResult: cacheData, error: null });
        }
        try {
          setLoading(true);
          const res = await client.request(opts);
          if (isNetworkError(res.status)) {
            return updateQuery(responseData, { fetchMoreResult: null, error: res.data });
          }
          setData({ [cacheKey(opts)]: res.data });
          return updateQuery(responseData, { fetchMoreResult: res.data, error: null });
        } catch (e) {
          return updateQuery(responseData, { fetchMoreResult: null, error: e.message });
        }
      };
      setLoading(true);
      const updatedData = await updateQueryResult();
      setLoading(false);
      setResData(updatedData);
    }
  };

  return [fetch, {
    data: responseData, loading, error, networkStatus, fetchMore,
  }];
};

export default useRequest;
