## Tremor Tinybird Plugin

```
npm i trm-tb-plugin
```

### API

The plugin exports a `useFetchPipe` function that provides a single interface to easily query [Tinybird pipes](https://www.tinybird.co/docs/concepts/pipes.html) using [SWR](https://swr.vercel.app/).

_Note_: Only JSON responses are supported for now and SWR `^2.0.0` is required.

**Arguments:**

- `name`: The name of the Tinybird pipe.
- `queryParams` (optional): The query parameters of the pipe as a JSON-object.
- `config` (optional): The Tinybird configuration as a JSON-object.
- `responseType` (optional): The API response type. `'JSON' | 'CSV' | 'Ndjson' | 'Parquet'`

**Example:**

```jsx
// Example.tsx
import { useFetchPipe } from 'trm-tb-plugin';
import { LineChart } from '@tremor/react';

export default function Example() {
  const { data, status } = useFetchPipe('my_sales_data_pipe', {
    date_from: '2023-01-01',
    date_to: '2023-03-01'
  });

  return status === 'loading' ? (
    <p>Loading...</p>
  ) : (
    <LineChart data={data} index="date" categories={['sales', 'profit']} />
  );
}
```

### Configuration

Configuration parameters:

- `token`: The Tinybird auth token
- `baseUrl` (optional): The Tinybird API base url, i.e. the tinybird pipe prefix up to the pipe name. Default: `https://api.tinybird.co/v0/pipes/`

**(1) Using the `TbConfigProvider`:**

```jsx
// ContextProvider.tsx
import { TbConfigProvider } from 'trm-tb-plugin';

export default function ContextProvider({ children }) {
  const [token, setToken] = useState('<my tinybird auth token>');
  // Optional
  const [baseUrl, setBaseUrl] = useState('https://ui.us-east.tinybird.co/v0/pipes/');

  return (
    <TbConfigProvider token={token} setToken={setToken} baseUrl={baseUrl} setBaseUrl={setBaseUrl}>
      {children}
    </TbConfigProvider>
  );
}
```

The config values can be set in one of the `TbConfigProvider`s child components using the `TbConfigContext` and the provided setters:

```jsx
// Example.tsx
import { TbConfigContext } from 'trm-tb-plugin';
import { useContext } from 'react';

...
const { setToken, setBaseUrl } = useContext(TbConfigContext);
...
```

Once the config parameters are set in the `TbConfigProvider`, the `useFetchPipe` function will automatically obtain the config from the `TbConfigContext`.

**(2) Directly providing a config via the `config` argument of the `useFetchPipe` as a JSON-object.**

```jsx
const { data } = useFetchPipe(
  'my_pipe',
  {
    date_from: '2023-01-01',
    date_to: '2023-03-01'
  },
  {
    token: '<my tinybird token>',
    // Optional
    baseUrl: 'https://api.us-east.tinybird.co/v0/pipes/'
  }
);
```
