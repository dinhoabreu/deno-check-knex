import type { Knex } from 'knex'

const config: Knex.Config = {
  client: 'pg',
  connection: 'pg://user1:pass1@localhost/db1',
}

export default config
