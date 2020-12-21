import useRequest from './useRequest';

const useLazyGet = (path, options = {}) => useRequest(path, {
  ...options,
  method: 'GET',
});

export default useLazyGet;
