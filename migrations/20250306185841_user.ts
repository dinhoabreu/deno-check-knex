import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    })
  await knex.raw(`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)
  await knex.raw(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
  await knex.raw('DROP TRIGGER IF EXISTS set_timestamp ON users')
  await knex.raw('DROP FUNCTION IF EXISTS trigger_set_timestamp()')
}
