import { Algorithm } from 'jsonwebtoken'
interface AuthConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  jwtAlgorithm: Algorithm
  jwtAudience: string
  jwtAuthScheme: string
  jwtIssuer: string
  jwtSecret: string
  dbEntitiesPath: string[]
  dbsslconn: string
}

export default (): AuthConfig => {
  const {
    PGENTITIES = '',
    PGDATABASE = 'development',
    PGHOST = 'localhost',
    PGPASSWORD = '',
    PGPORT,
    PGSSL = '',
    PGUSER = 'raven',
    NODE_ENV,
  } = process.env

  const jwtConfig = getJwtConfig()

  if (NODE_ENV === 'test') {
    return {
      host: 'localhost',
      port: 5432,
      database: 'armada_test',
      user: 'test_user',
      password: 'test_password',
      dbEntitiesPath: [],
      dbsslconn: PGSSL,
      ...jwtConfig,
    }
  }
  let port = 5432
  if (PGPORT) {
    port = parseInt(PGPORT, 10)
  }
  return {
    host: PGHOST,
    port,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    dbEntitiesPath: PGENTITIES.split(','),
    dbsslconn: PGSSL,
    ...jwtConfig,
  }
}

function getJwtConfig() {
  const {
    JWT_SECRET = 'your-secret-whatever',
    JWT_ALG = 'HS256',
    JWT_AUDIENCE = '',
    JWT_AUTH_SCHEME = 'Bearer',
    JWT_ISSUER = '',
  } = process.env
  return {
    jwtAlgorithm: retrieveJwtAudience(JWT_ALG),
    jwtAudience: JWT_AUDIENCE,
    jwtAuthScheme: JWT_AUTH_SCHEME,
    jwtIssuer: JWT_ISSUER,
    jwtSecret: JWT_SECRET,
  }
}

function retrieveJwtAudience(audience: string): Algorithm {
  const ALGO: Algorithm[] = [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'ES256',
    'ES384',
    'ES512',
    'PS256',
    'PS384',
    'PS512',
    'none',
  ]

  return ALGO.find(x => x === audience) || 'none'
}
