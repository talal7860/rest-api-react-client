import { getOr, merge } from 'lodash/fp';
import useApiClient from './useApiClient';
import useRequestHandler from './useRequestHandler';

const getParams = getOr({}, 'params');
const getHeaders = getOr({}, 'headers');

const usePost = (path, options = {}) => {
  const { fetchClient } = useApiClient();
  const {
    loading, request, error, data,
  } = useRequestHandler(path, 'POST', options);

  const post = (fetchOptions) => {
    request(() => fetchClient.post({
      local: options.local,
      path,
      headers: getHeaders(fetchOptions),
      body: {
        ...getParams(merge(options, fetchOptions)),
      },
      json: true,
    }));
  };

  return [post, { loading, data, error }];
};

export default usePost;
