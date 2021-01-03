import useRequestHandler from './useRequestHandler';

const useLazyGet = (path: string, options: RequestOptions = {}): [any, ApiResponseOptions] => useRequestHandler(path, {
  ...options,
  method: 'GET',
});

export default useLazyGet;
