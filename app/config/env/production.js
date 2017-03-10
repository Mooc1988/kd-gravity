/**
 * Created by frank on 2016/11/1.
 */

module.exports = {
  host: 'localhost',
  port: process.env.NODE_PORT || 3000,
  db: {
    database: 'kd-sound',
    username: 'mooc1988',
    password: 'Mooc1988',
    config: {
      host: 'rdsfom58rh8q9mrl8885.pg.rds.aliyuncs.com',
      port: 3433,
      dialect: 'postgres'
    }
  }
}
