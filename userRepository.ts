import type { Knex } from 'knex'

export interface User {
  id?: number
  name: string
  created_at?: Date
  updated_at?: Date
}

export class UserRepository {
  private knex: Knex

  constructor(knex: Knex) {
    this.knex = knex
  }

  async create(user: User): Promise<User> {
    const [insertedUser] = await this.knex<User>('users')
      .insert({ name: user.name })
      .returning('*')

    return insertedUser
  }

  async findAll(): Promise<User[]> {
    return await this.knex<User>('users').select('*')
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const [updatedUser] = await this.knex<User>('users')
      .where({ id })
      .update(userData)
      .returning('*')

    return updatedUser || null
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await this.knex<User>('users').where({ id }).delete()

    return deletedRows > 0
  }
}
