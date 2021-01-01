import { useEffect } from 'react';
import { getOr } from 'lodash/fp';
import useLazyGet from './useLazyGet';

const getParams = getOr({}, 'query');

const useGet = (path, options = {}) => {
  const [fetch, res] = useLazyGet(path, options);

  useEffect(() => {
    fetch(options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(getParams(options))]);

  return res;
};

export default useGet;
