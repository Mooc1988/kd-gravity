/**
 * Created by frank on 2017/3/28.
 */

const _ = require('lodash')
const Redis = require('ioredis')

module.exports = app => cb => {
  const {redisConfig} = app.config
  let config = _.assign({retryStrategy}, redisConfig)
  const redis = new Redis(config)
  redis.on('connect', function () {
    console.log('redis 连接成功')
    app.redis = redis
    cb(null)
  })

  redis.on('error', function (err) {
    cb(new Error('redis 连接失败'))
    console.error(err)
  })
}

function retryStrategy (times) {
  return Math.min(times * 50, 2000)
}
