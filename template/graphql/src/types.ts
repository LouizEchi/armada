export interface Response {
  body: string
  headers: {
    [key: string]: string | boolean
  }
  statusCode: number
}

export interface Params {
  title?: string
  contents?: string
}

export interface Filters extends Params {
  parent_id?: number
  limit?: number
  order?: number
  slug?: string
}

export interface UserRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  company?: string
  is_active?: boolean
}

export interface Root {
  [key: string]: any
}

export interface UserUpdateRequest {
  id?: number
  email?: string
  password?: string
  first_name?: string
  last_name?: string
  company?: string
  is_active?: boolean
}

export interface UserContext {
  kastle_key: string
}

export interface ValidationError {
  errors: {
    [key: string]: string
  }
  statusCode: number
}
