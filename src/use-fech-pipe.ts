import { useContext } from 'react';

import { useQuery } from './use-query';
import { TbConfigContext } from './tb-config';
import client from './client';
import { TbConfig, QueryPipe, ResponseType } from './types';
import { BASE_URL } from './constants';

function queryPipe<PipeParams, QueryParams>(
  name: string,
  params: Partial<QueryParams> = {},
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

type PipeFetcherArgs<QueryParams> = [
  name: string,
  params: Partial<QueryParams>,
  config: TbConfig,
  responseType: ResponseType
];
async function pipeFetcher<PipeParams, QueryParams>([
  name,
  params,
  config,
  responseType
]: PipeFetcherArgs<QueryParams>) {
  const { data } = await queryPipe<PipeParams, QueryParams>(name, params, config, responseType);

  return data;
}

export default function useFetchPipe<PipeParams, QueryParams = object>(
  name: string,
  queryParams: Partial<QueryParams> = {},
  config?: TbConfig,
  responseType: ResponseType = 'JSON'
) {
  const configContext = useContext(TbConfigContext);
  const token = configContext.token || config?.token;
  const baseUrl = config?.baseUrl ?? configContext.baseUrl ?? BASE_URL;

  if (!token) throw new Error('Tinybird token not found');

  return useQuery(
    [name, queryParams, { token, baseUrl }, responseType],
    pipeFetcher<PipeParams, QueryParams>
  );
}
