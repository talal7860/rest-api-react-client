/* Utility functions */
import {
  getOr, pick,
} from 'lodash/fp';
import NETWORK_POLICY from './constants/networkPolicy';

const baseUrlGet = getOr('', 'baseUrl');
const getPath = getOr('', 'path');
const getMethod = getOr('GET', 'method');

export const cacheKey = (options) => JSON.stringify({
  method: getMethod(options),
  path: `${baseUrlGet(options)}${getPath(options)}`,
  ...pick(['query'])(options),
});

export const canUseCache = (options) => {
  const method = getMethod(options);
  const networkPolicy = getOr(NETWORK_POLICY.cache, 'network-policy', options);
  return networkPolicy === NETWORK_POLICY.cache && method === 'GET';
};

export const isNetworkError = (status) => status < 200 || status >= 299;
