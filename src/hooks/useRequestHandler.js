import { useEffect, useState } from 'react';
import { get, isEmpty } from 'lodash/fp';
import useApiClient from './useApiClient';
import { cacheKey, canUseCache, isNetworkError } from '../util';
import NETWORK_STATUS from '../constants/networkStatus';

const useRequestHandler = (path, requestOptions = {}) => {
  const {
    data, setData, client,
  } = useApiClient();
  const [networkStatus, setNetworkStatus] = useState(NETWORK_STATUS.initial);
  const [options, setOptions] = useState(requestOptions);
  const [loading, setLoading] = useState(options.loading || false);
  const [error, setError] = useState(null);
  const key = cacheKey(path, options);
  const cacheData = get(key)(data);

  const request = () => {
    if (canUseCache(options) && !isEmpty(cacheData)) {
      return;
    }
    setNetworkStatus(NETWORK_STATUS.started);
    setLoading(true);
    client.request(options).then((res) => {
      if (isNetworkError(res.status)) {
        setError(res.data);
        setLoading(false);
        setNetworkStatus(NETWORK_STATUS.completed);
      } else {
        setData({ [key]: res.data });
      }
    }).catch((err) => {
      setNetworkStatus(NETWORK_STATUS.completed);
      setError(err.message);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (loading) {
      setLoading(false);
      if (options.onCompleted && cacheData) {
        options.onCompleted(cacheData);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheData]);

  useEffect(() => {
    if (canUseCache(options, cacheData) && !isEmpty(cacheData) && options.onCompleted) {
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

  return {
    cacheKey: key,
    options,
    setOptions,
    loading,
    error,
    data: cacheData,
    networkStatus,
    setNetworkStatus,
    setLoading,
  };
};

export default useRequestHandler;
