import { ClientResponse, QueryError, TbConfig } from './types';

export default async function client<T>(
  path: string,
  params?: RequestInit,
  config?: TbConfig
): Promise<ClientResponse<T>> {
  console.log('TOKEN', config?.token);
  console.log('BASE_URL', config?.baseUrl);
  if (!config?.token || !config?.baseUrl) throw new Error('Configuration not found');
  const { token, baseUrl } = config;

  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    ...params
  });
  const data = (await response.json()) as ClientResponse<T>;

  if (!response.ok) {
    throw new QueryError(data?.error ?? 'Something went wrong', response.status);
  }
  return data;
}
