import { HttpStatus } from '@g-six/kastle-router'
import { ApolloError } from 'apollo-server-lambda'

import { sign } from 'jsonwebtoken'
import { Scopes } from './constants'
import { User } from './entity'
import { openRepository, generateExactQuery, generateLikeQuery } from './util'

import getEnv from '../config'

const config = getEnv()

// Ideally should be seperated inside a serverless component then extended inside a package

export interface UserQuery {
  id?: number
  email?: string
  first_name?: string
  last_name?: string
  company?: string
  is_active?: boolean
}

export class UserModel extends User {
  public static async createUser(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    company?: string,
  ) {
    const userRepository = await openRepository<User>(User)

    const userToBeSaved: User = new User()
    userToBeSaved.first_name = first_name
    userToBeSaved.last_name = last_name
    userToBeSaved.email = email

    userToBeSaved.company = company || ''
    userToBeSaved.is_active = true

    userToBeSaved.hashPassword(password)

    return userRepository.save(userToBeSaved)
  }

  public static async listUser(
    id?: number,
    email?: string,
    first_name?: string,
    last_name?: string,
    company?: string,
    is_active?: boolean,
  ) {
    const userRepository = await openRepository<User>(User)

    const like_queries = generateLikeQuery<UserQuery>({
      email,
      first_name,
      last_name,
      company,
    })

    const exact_queries = generateExactQuery<UserQuery>({
      id,
      is_active,
    })

    console.log(like_queries, exact_queries)

    const userList: User[] = await userRepository.find({
      where: {
        ...exact_queries,
        ...like_queries,
      },
    })

    return userList
  }

  public static async updateUser(
    id: number,
    email?: string,
    password?: string,
    first_name?: string,
    last_name?: string,
    company?: string,
    is_active?: boolean,
  ) {
    const userRepository = await openRepository<User>(User)

    const userToBeUpdated: User | undefined = await userRepository.findOne(
      +id || 0,
    )

    if (!userToBeUpdated) {
      throw new ApolloError('The user does not exist.', HttpStatus.E_400)
    }

    const fields = {
      email,
      password,
      first_name,
      last_name,
      company,
      is_active,
    }

    Object.entries(fields)
      .filter(entry => entry[0] !== undefined)
      .map(entry => {
        const [field_name, value] = entry
        userToBeUpdated![field_name] = value
      })

    return userRepository.save(userToBeUpdated!)
  }

  public static async retrieveUser(id: number) {
    const userRepository = await openRepository<User>(User)

    const userToBeRetrieved: User | undefined = await userRepository.findOne(
      +id || 0,
    )

    if (!userToBeRetrieved) {
      throw new ApolloError('The user does not exist.', HttpStatus.E_400)
    }

    return userToBeRetrieved
  }

  public static async removeUser(id: number) {
    const userRepository = await openRepository<User>(User)

    const userToBeRemoved: User | undefined = await userRepository.findOne(
      +id || 0,
    )

    if (!userToBeRemoved) {
      throw new ApolloError('The user does not exist.', HttpStatus.E_400)
    }

    return userRepository.remove(userToBeRemoved!)
  }

  protected generateToken(scopes: Scopes[]): string {
    const header = {
      algorithm: config.jwtAlgorithm,
      expiresIn: '30d',
      audience: config.jwtAudience,
      issuer: config.jwtIssuer,
    }

    const payload = {
      id: this.id,
      scopes,
    }

    return sign(payload, config.jwtSecret, header)
  }
}
