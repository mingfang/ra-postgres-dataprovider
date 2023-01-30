# ra-postgres-dataprovider
React-Admin Postgres Data Provider

## Sample
```jsx
import { useEffect, useState } from 'react'
import { Admin, EditGuesser, ListGuesser, Loading, Resource } from 'react-admin'
const { Client } = require('pg')
import dataProviderFactory from 'ra-postgres-dataprovider'

const DATABASE_URL = 'postgresql://postgres:postgres@postgres:5432/postgres?sslmode=disable'

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
