/* Utility functions */
import {
  getOr, includes, pick,
} from 'lodash/fp';
import NETWORK_POLICY from './constants/networkPolicy';

const JSON_ACCEPT_HEADERS = 'json';

export const cacheKey = (options: any): string => JSON.stringify({
  method: options?.method || 'GET',
  path: `${options?.baseUrl || ''}${options?.path || ''}`,
  ...pick(['query'])(options),
});

export const canUseCache = (options: RequestOptions): boolean => {
  const method = options?.method || 'GET';
  const networkPolicy = getOr(NETWORK_POLICY.cache, 'network-policy', options);
  return networkPolicy === NETWORK_POLICY.cache && method === 'GET';
};

export const isNetworkError = (status: number): boolean => status < 200 || status >= 299;

export const isJsonHeader = (headers: Headers) : boolean => includes(JSON_ACCEPT_HEADERS)(headers.get('Accept'));