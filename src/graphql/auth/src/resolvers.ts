import { HttpStatus } from '@g-six/kastle-router'

import { ApolloError } from 'apollo-server-lambda'
import { UserModel } from './model'

import { Root, UserRequest, UserUpdateRequest } from './types'

const errorResponse = (code: number, error: string, errors?: {}) => {
  throw new ApolloError(error, String(code), errors)
}

async function userCreate(_: Root, args: UserRequest) {
  const { email, password, first_name, last_name, company } = args

  if (!email || !password) {
    errorResponse(400, HttpStatus.E_400)
  }

  const data = await UserModel.createUser(
    email,
    password,
    first_name,
    last_name,
    company,
  )

  return data
}

async function userList(_: Root, args: UserUpdateRequest) {
  const { id, email, first_name, last_name, company, is_active } = args

  const data = await UserModel.listUser(
    id,
    email,
    first_name,
    last_name,
    company,
    is_active,
  )

  return data
}

async function userRetrieve(_: Root, args: UserUpdateRequest) {
  const { id } = args

  const data = await UserModel.retrieveUser(id!)

  return data
}

async function userRemove(_: Root, args: UserUpdateRequest) {
  const { id } = args

  const data = await UserModel.removeUser(id!)

  return data
}

async function userUpdate(_: Root, args: UserUpdateRequest) {
  const {
    id,
    email,
    password,
    first_name,
    last_name,
    company,
    is_active,
  } = args

  const data = await UserModel.updateUser(
    id!,
    email,
    password,
    first_name,
    last_name,
    company,
    is_active,
  )

  return data
}

export const resolvers = {
  Query: {
    userList,
    userRetrieve,
  },
  Mutation: {
    userCreate,
    userRemove,
    userUpdate,
  },
}
