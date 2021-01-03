import { useEffect } from 'react';
import { useGet } from 'rest-api-react-client';
import { perPage } from '../constants';

const useReposWithCache = () => {
  const res = useGet('/user/repos', {
    json: true,
    'network-policy': 'cache',
    query: {
      per_page: perPage,
      page: 1,
    },
  });
  useEffect(() => {
    console.log('RES_DATA_RES_DATA', res.data);
  }, [res.data]);

  return res;
};

export default useReposWithCache;
