import useRequestHandler from './useRequestHandler';

const useDelete = (path: string, options: RequestOptions = {}): [any, ApiResponseOptions] => useRequestHandler(path, {
  ...options,
  method: 'DELETE',
});

export default useDelete;
