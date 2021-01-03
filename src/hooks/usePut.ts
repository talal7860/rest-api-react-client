import useRequestHandler from './useRequestHandler';

const usePost = (path: string, options: RequestOptions = {}): [any, ApiResponseOptions] => useRequestHandler(path, {
  ...options,
  method: 'PUT',
});

export default usePost;
