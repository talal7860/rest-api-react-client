import { useEffect, useState } from 'react';
import { get, getOr } from 'lodash/fp';
import useApiClient from './useApiClient';

const useRequestHandler = (path, options = {}) => {
  const { cacheKey, data, setData } = useApiClient();
  const method = getOr('GET', 'method', options);
  const [loading, setLoading] = useState(options.loading || false);
  const [error, setError] = useState(null);
  const key = cacheKey(`${getOr('', 'baseUrl')(options)}${path}`, {
    params: options.params,
    query: options.query,
    method,
  });

  const request = (callback) => {
    setLoading(true);
    callback().then((res) => {
      if (res.status < 200 || res.status >= 299) {
        setError(res);
        setLoading(false);
      } else {
        setData({ [key]: res.data });
      }
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
