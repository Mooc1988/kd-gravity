/**
 * Created by frank on 2016/11/1.
 */

module.exports = {
  host: 'localhost',
  port: process.env.NODE_PORT || 3000,
  jwtSecret: 'i love kuando',
  db: {
    database: 'kd-sound',
    username: 'frank',
    password: null,
    config: {
      host: 'localhost',
      dialect: 'postgres'
    }
  },
  redisConfig: {
    host: 'localhost'
  }
}
