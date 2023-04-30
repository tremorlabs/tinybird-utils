import { ClientResponse, QueryError, ResponseType, TbConfig } from './types';

export default async function client<T>(
  path: string,
  params?: RequestInit,
  config?: TbConfig,
  responseType: ResponseType = 'JSON'
): Promise<ClientResponse<T>> {
  if (!config?.token || !config?.baseUrl) throw new Error('Configuration not found');
  const { token, baseUrl } = config;

  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    ...params
  });

  let data;
  if (responseType == 'JSON') {
    data = (await response.json()) as ClientResponse<T>;
  } else {
    data = (await response.text()) as ClientResponse<T>;
  }

  if (!response.ok) {
    throw new QueryError(data?.error ?? 'Something went wrong', response.status);
  }
  return data;
}
