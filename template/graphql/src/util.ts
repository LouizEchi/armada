import { Database } from '../database'

import { Repository, Connection, EntitySchema, Like } from 'typeorm'

export async function openRepository<T>(
  type: string | Function | (new () => T) | EntitySchema<T>,
): Promise<Repository<T>> {
  const database = new Database()
  const dbConn: Connection = await database.getConnection()
  return dbConn.getRepository(type)
}

export function generateExactQuery<T>(filter: T) {
  return Object.entries(filter)
    .filter(entry => entry[1] !== undefined)
    .reduce(
      (new_filter, entry) => ({
        [entry[0]]: entry[1],
        ...new_filter,
      }),
      {},
    )
}

export function generateLikeQuery<T>(filter: T) {
  return Object.entries(filter)
    .filter(entry => entry[1] !== undefined)
    .reduce(
      (new_filter, entry) => ({
        [entry[0]]: Like(entry[1]),
        ...new_filter,
      }),
      {},
    )
}
