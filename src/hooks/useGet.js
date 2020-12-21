import { useEffect } from 'react';
import { getOr } from 'lodash/fp';
import useLazyGet from './useLazyGet';

const getParams = getOr({}, 'query');

const useGet = (path, options = {}) => {
  const [fetch, {
    fetchMore, loading, error, data,
  }] = useLazyGet(path, {
    ...options,
    loading: true,
  });

  useEffect(() => {
    fetch(options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(getParams(options))]);

  return {
    loading,
    data,
    error,
    fetchMore,
  };
};

export default useGet;
