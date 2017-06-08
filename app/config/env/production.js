/**
 * Created by frank on 2016/11/1.
 */

module.exports = {
  host: 'localhost',
  port: process.env.NODE_PORT || 7001,
  jwtSecret: 'i love kuando',
  db: {
    database: 'kd-sound',
    username: 'mooc1988',
    password: 'Mooc1988',
    config: {
      host: 'rdsfom58rh8q9mrl8885.pg.rds.aliyuncs.com',
      port: 3433,
      dialect: 'postgres',
      pool: {
        max: 20,
        min: 5,
        idle: 10000
      }
    }
  },
  redisConfig: {
    host: 'a97582a7d76211e4.m.cnbja.kvstore.aliyuncs.com',
    port: 6379,
    password: 'a97582a7d76211e4:Mooc1988',
    db: 1
  }
}
