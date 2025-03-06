import { after, before, describe, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import Knex from 'knex'
import type { Knex as KnexType } from 'knex'
import config from './knexfile.ts'
import { UserRepository } from './userRepository.ts'

describe('UserRepository CRUD operations', () => {
  let knex: KnexType
  let userRepository: UserRepository

  before(async () => {
    knex = Knex(config)
    userRepository = new UserRepository(knex)
    await knex('users').delete() // Ensures a clean state before each test
  })

  after(async () => {
    await knex.destroy()
  })

  it('should insert a user with timestamps', async () => {
    const user = await userRepository.create({ name: 'test' })

    expect(user).toMatchObject({
      id: expect.any(Number),
      name: 'test',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    })

    // Ensure created_at and updated_at are close to now
    const now = new Date()
    expect(new Date(user.created_at as Date).getTime()).toBeLessThanOrEqual(
      now.getTime(),
    )
    expect(new Date(user.updated_at as Date).getTime()).toBeLessThanOrEqual(
      now.getTime(),
    )
  })

  it('should retrieve all users and verify timestamps', async () => {
    const user = await userRepository.create({ name: 'test' })
    const users = await userRepository.findAll()

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: user.id,
          name: 'test',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }),
      ]),
    )
  })

  it('should update a user name and ensure updated_at is changed', async () => {
    const user = await userRepository.create({ name: 'test' })
    const updatedUser = await userRepository.update(user.id as number, {
      name: 'updated_test',
    })

    expect(updatedUser).toMatchObject({
      id: user.id,
      name: 'updated_test',
      created_at: user.created_at, // created_at should remain unchanged
      updated_at: expect.any(Date),
    })

    // Ensure updated_at has changed
    expect(new Date(updatedUser!.updated_at as Date).getTime()).toBeGreaterThan(
      new Date(user.updated_at as Date).getTime(),
    )
  })

  it('should delete a user and ensure it is removed', async () => {
    const user = await userRepository.create({ name: 'test' })
    const deleted = await userRepository.delete(user.id as number)

    expect(deleted).toBe(true)

    const users = await userRepository.findAll()
    expect(users.some((u) => u.id === user.id)).toBe(false)
  })
})
