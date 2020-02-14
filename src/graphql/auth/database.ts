import {
  Connection,
  ConnectionManager,
  createConnection,
  getConnectionManager,
} from 'typeorm'
import { AutoEncryptSubscriber } from 'typeorm-encrypted'

import getEnv from './config'

import 'reflect-metadata'

const config = getEnv()

export class Database {
  private connectionManager: ConnectionManager

  constructor() {
    this.connectionManager = getConnectionManager()
  }

  public async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = `default`

    let connection: Connection

    if (this.connectionManager.has(CONNECTION_NAME)) {
      console.log(`Database.getConnection()-using existing connection ...`)
      connection = await this.connectionManager.get(CONNECTION_NAME)

      if (!connection.isConnected) {
        connection = await connection.connect()
      }
    } else {
      console.log(`Database.getConnection()-creating connection ...`)

      connection = await createConnection({
        type: 'postgres',
        host: config.host,
        port: config.port,
        username: config.user,
        password: config.password,
        database: config.database,
        synchronize: true,
        logging: false,
        entities: ['.build/src/entity.js'],
        extra: {
          ssl: config.dbsslconn, // if not development, will use SSL
        },
        subscribers: [AutoEncryptSubscriber],
      })
    }

    return connection
  }
}
