import { getOr, merge, isEmpty } from 'lodash/fp';
import useApiClient from './useApiClient';
import useRequestHandler from './useRequestHandler';

const getParams = getOr({}, 'params');
const getQuery = getOr({}, 'query');
const getHeaders = getOr({}, 'headers');

const useRequest = (path, options = {}) => {
  const { fetchClient } = useApiClient();
  const {
    loading, request, error, data,
  } = useRequestHandler(path, options);

  const fetch = (fetchOptions) => {
    const mergedOptions = merge(options, fetchOptions);
    const requestOptions = {
      ...options,
      path,
      headers: getHeaders(fetchOptions),
    };
    if (!isEmpty(getQuery(mergedOptions))) {
      requestOptions.query = getQuery(mergedOptions);
    }
    if (!isEmpty(getParams(mergedOptions))) {
      requestOptions.body = getParams(mergedOptions);
    }
    request(() => fetchClient.request(requestOptions));
  };

  return [fetch, { loading, data, error }];
};

export default useRequest;
