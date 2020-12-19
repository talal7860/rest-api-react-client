import { getOr, merge } from 'lodash/fp';
import useApiClient from './useApiClient';
import useRequestHandler from './useRequestHandler';

const getParams = getOr({}, 'params');

const useLazyGet = (path, options = {}) => {
  const { fetchClient } = useApiClient();
  const {
    loading, request, error, data,
  } = useRequestHandler(path, 'GET', options);
  useRequestHandler(options);

  const fetchMore = (fetchOptions) => {
    request(() => fetchClient.get({
      path,
      local: options.local,
      query: {
        ...getParams(merge(options, fetchOptions)),
      },
      json: true,
    }));
  };

  return [
    fetchMore, {
      loading, data, error, fetchMore,
    },
  ];
};

export default useLazyGet;
