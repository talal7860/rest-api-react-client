import useRequest from './useRequest';

const usePost = (path, options = {}) => useRequest(path, {
  ...options,
  method: 'POST',
});

export default usePost;
