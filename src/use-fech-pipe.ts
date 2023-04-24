import { useContext } from 'react';

import { useQuery } from './use-query';
import { TbConfigContext } from './tb-config';
import client from './client';
import { PipeParams, TbConfig, QueryPipe } from './types';
import { BASE_URL } from './constants';

function queryPipe<T>(
  name: string,
  params: Partial<PipeParams<T>> = {},
  config: TbConfig
): Promise<QueryPipe<T>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;
    searchParams.set(key, value as string);
  });

  return client(`${name}.json?${searchParams}`, {}, config);
}

type PipeFetcherArgs<T> = [name: string, params: Partial<PipeParams<T>>, config: TbConfig];
async function pipeFetcher<T>([name, params, config]: PipeFetcherArgs<T>) {
  const { data } = await queryPipe(name, params, config);

  return data;
}

export default function useFetchPipe<T>(
  name: string,
  queryParams: Partial<PipeParams<T>> = {},
  config?: TbConfig
) {
  const contextConfig = useContext(TbConfigContext);
  const token = contextConfig.token || config?.token;
  const baseUrl = config?.baseUrl ?? contextConfig.baseUrl ?? BASE_URL;

  if (!token) throw new Error('Tinybird token not found');

  return useQuery([name, queryParams, { token: token, baseUrl: baseUrl }], pipeFetcher<T>);
}
