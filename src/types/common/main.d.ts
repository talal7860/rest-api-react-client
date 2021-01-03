declare type ApiQuery = any
declare type ApiBody = string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null | undefined;
declare type ApiData = any

interface RequestOptions extends RequestInit {
  path?: string;
  query?: ApiQuery;
  body?: ApiBody;
  baseUrl?: string | null | undefined;
  onCompleted?(res: ApiBody): void;
  onError?(error: ClientResponse): void;
  loading?: boolean;
  headers?: Headers;
  initialHeaders?: any;
  json?: boolean;
}

interface ClientResponse {
  status: number;
  statusText: string;
  data: Record<string, unknown> | [Record<string, unknown>] | string
}

interface FetchMore {
  query: Record<string, number | string>;
  updateQuery(response: ApiData, updatedResponse: ApiData): ApiData;
}

interface ApiResponseOptions {
  data: ApiData;
  loading: boolean;
  error: ClientResponse | undefined,
  networkStatus: number,
  fetchMore(options: FetchMore): void,
}

declare type ApiResponse = [any, ApiResponseOptions]

interface WriteDataOptions {
  params: ApiData | ApiQuery;
  data: ApiData;
  method: string;
}

interface CacheOptions {
  params: ApiBody | ApiQuery;
  method: string;
  path: string;
}

// declare enum NetworkStatus {
//   Initial = 1,
//   Started,
//   Completed,
//   FetchMore,
// }
