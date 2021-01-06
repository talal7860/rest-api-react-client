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

  return res;
};

export default useReposWithCache;
