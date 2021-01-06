import { useEffect } from 'react';
import { get } from 'lodash/fp';
import useLazyGet from './useLazyGet';

const getParams = get('query');

const useGet = (path: string, options: RequestOptions = {}): ApiResponseOptions => {
  const [fetch, res] = useLazyGet(path, {
    ...options,
    loading: true,
  });

  useEffect(() => {
    fetch(options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(getParams(options) || {})]);

  return res;
};

export default useGet;
