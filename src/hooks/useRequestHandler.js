import { useEffect, useState } from 'react';
import { get } from 'lodash/fp';
import useApiClient from './useApiClient';

const useRequestHandler = (path, method, options = {}) => {
  const { cacheKey, data, setData } = useApiClient();
  const [loading, setLoading] = useState(options.loading || false);
  const [error, setError] = useState(null);
  const key = cacheKey(path, {
    params: options.params,
    method,
  });

  const request = (callback) => {
    setLoading(true);
    callback().then((res) => {
      setData({ [key]: res.data });
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (loading) {
      setLoading(false);
      if (options.onCompleted) {
        options.onCompleted(data[key]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, key]);

  useEffect(() => {
    if (error && options.onError) {
      options.onError(error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    cacheKey: key,
    request,
    loading,
    error,
    data: get(key, data),
  };
};

export default useRequestHandler;
