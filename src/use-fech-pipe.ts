import { useContext } from 'react';

import { useQuery } from './use-query';
import { TbConfigContext } from './tb-config';
import client from './client';
import { TbConfig, QueryPipe, ResponseType } from './types';
import { BASE_URL } from './constants';

function queryPipe<PipeParams>(
  name: string,
  params: Partial<PipeParams> = {},
  config: TbConfig,
  responseType: ResponseType
): Promise<QueryPipe<PipeParams>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;
    searchParams.set(key, value as string);
  });

  return client(`${name}.${responseType.toLowerCase()}?${searchParams}`, {}, config, responseType);
}

type PipeFetcherArgs<PipeParams> = [
  name: string,
  params: Partial<PipeParams>,
  config: TbConfig,
  responseType: ResponseType
];
async function pipeFetcher<PipeParams>([
  name,
  params,
  config,
  responseType
]: PipeFetcherArgs<PipeParams>) {
  const { data } = await queryPipe(name, params, config, responseType);

  return data;
}

export default function useFetchPipe<PipeParams>(
  name: string,
  queryParams: Partial<PipeParams> = {},
  config?: TbConfig,
  responseType: ResponseType = 'JSON'
) {
  const configContext = useContext(TbConfigContext);
  const token = configContext.token || config?.token;
  const baseUrl = config?.baseUrl ?? configContext.baseUrl ?? BASE_URL;

  if (!token) throw new Error('Tinybird token not found');

  return useQuery([name, queryParams, { token, baseUrl }, responseType], pipeFetcher<PipeParams>);
}
