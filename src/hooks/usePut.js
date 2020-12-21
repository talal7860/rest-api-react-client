import useRequest from './useRequest';

const usePost = (path, options = {}) => useRequest(path, {
  ...options,
  method: 'PUT',
});

export default usePost;
