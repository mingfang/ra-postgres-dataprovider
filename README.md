# ra-postgres-dataprovider
React-Admin Postgres Data Provider

## Requirements
[node-postgres](https://github.com/brianc/node-postgres) is server side only.

To work on the client side, then the combination of
[Neon WSProxy](https://github.com/neondatabase/wsproxy) and
[Neon Serverless](https://github.com/neondatabase/serverless)

```mermaid
---
title: Client-Server Data Flow
---
flowchart LR
  subgraph Client-Side
    ra([React-Admin])
    provider[ra-postgres-dataprovider]
  end
  subgraph Server-Side
  proxy[WSProxy]
  db[(Postgres)]
  end
ra-->provider-. WebSocket .->proxy-->db
```

## Sample
```jsx
import { useEffect, useState } from 'react'
import { Admin, EditGuesser, ListGuesser, Loading, Resource } from 'react-admin'
import dataProviderFactory from 'ra-postgres-dataprovider'

// use node-postgres
import { Client } from 'pg'

// or use Neon
import { Client, neonConfig } from '@neondatabase/serverless'
neonConfig.wsProxy = (host, port) => `wsproxy/v1?address=${host}:${port}`
neonConfig.useSecureWebSocket = true

const DATABASE_URL = process.env.DATABASE_URL

export default () => {
  const [dataProvider, setDataProvider] = useState(null)

  useEffect(()=>{
    const startDataProvider = async () => {
      const client = new Client(DATABASE_URL)
      await client.connect()
      await client.query("set schema 'public'")
      setDataProvider(dataProviderFactory(client));
    }

    if (dataProvider === null) {
      startDataProvider();
    }
  }, [dataProvider])

  if (dataProvider === null) return <Loading />

  return (
    <>
      <Admin dataProvider={dataProvider}>
        <Resource name="example-table" list={ListGuesser} edit={EditGuesser}/>
      </Admin>
    </>
  )
}
```
