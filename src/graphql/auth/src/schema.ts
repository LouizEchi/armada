import { gql } from 'apollo-server-lambda'

const Query = gql`
  type Query {
    userRetrieve(id: Int!): User

    userList(
      id: Int
      email: String
      password: String
      first_name: String
      last_name: String
      company: String
      is_active: Boolean
    ): [User]
  }
`

const Mutation = gql`
  type Mutation {
    userCreate(
      email: String!
      password: String!
      first_name: String!
      last_name: String!
      company: String
      is_active: Boolean
    ): User

    userUpdate(
      id: Int!
      email: String
      password: String
      first_name: String
      last_name: String
      company: String
      is_active: Boolean
    ): User
    userRemove(id: Int!): User
  }
`

const Types = gql`
  type User {
    id: Int!
    email: String!
    first_name: String!
    last_name: String!
    company: String
    is_active: Boolean
  }
`

export const schema = gql`
  ${Query}

  ${Mutation}

  ${Types}
`
