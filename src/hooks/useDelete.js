import useRequest from './useRequest';

const usePost = (path, options = {}) => useRequest(path, {
  ...options,
  method: 'DELETE',
});

export default usePost;
