# Deno Project with Knex and Postgres

This project is a validation of using Knex in Deno to interact with a PostgreSQL
database. The application implements a user repository with CRUD operations and
includes automated tests to validate its functionality.

## Features

- **User CRUD:** Create, read, update, and delete users.
- **Automated Tests:** Uses tests with
  [@std/testing](https://jsr.io/@std/testing) to ensure the correct behavior
  of operations.
- **PostgreSQL Integration:** Database configuration using Docker Compose to
  facilitate setup and local execution.

## Project Structure

- **userRepository.ts:** Contains the implementation of the `UserRepository`
  class, which defines methods for handling users in the database.
- **userRepository_test.ts:** A set of tests to validate the CRUD operations
  implemented in the repository.
- **deno.json:** Deno configuration file that defines tasks, imports, and code
  formatting.
- **compose.yml:** Docker Compose file to spin up PostgreSQL services and a
  command-line interface (pgcli) to interact with the database.

## Requirements

- [Deno](https://deno.land/) installed (latest version recommended).
- [Docker](https://www.docker.com/) installed to run PostgreSQL and pgcli via
  Docker Compose.

## Environment Setup

```sh
# start postgres
docker compose up -d pg
# run pgcli
docker compose run --rm pgcli

# When running the Knex CLI with Deno, it is common to encounter:
# Failed to load external module ts-node/register
# Failed to load external module typescript-node/register
# Failed to load external module typescript-register
# Failed to load external module typescript-require
# Failed to load external module sucrase/register/ts
# Failed to load external module @babel/register
#
# This happens because Deno does not require any external modules to execute TypeScript.
deno task knex migrate:up

deno task test
```
