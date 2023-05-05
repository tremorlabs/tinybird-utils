import React, { createContext } from 'react';
import type { ReactNode } from 'react';

import { TbConfig } from './types';
import { BASE_URL } from './constants';

export const TbConfigContext = createContext<TbConfig>({
  baseUrl: undefined,
  token: undefined
});

export interface TbConfigProviderProps extends TbConfig {
  children: ReactNode;
}

export const TbConfigProvider = ({
  baseUrl = BASE_URL,
  token,
  children
}: TbConfigProviderProps) => (
  <TbConfigContext.Provider
    value={{
      baseUrl,
      token
    }}>
    {children}
  </TbConfigContext.Provider>
);
