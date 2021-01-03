import useRequestHandler from './useRequestHandler';

const usePost = (path: string, options: RequestOptions = {}): [any, ApiResponseOptions] => useRequestHandler(path, {
  ...options,
  method: 'POST',
});

export default usePost;
