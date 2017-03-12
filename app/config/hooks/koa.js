/**
 * Created by frank on 2016/11/30.
 */

'use strict'

const bodyParser = require('koa-bodyparser')
const cors = require('kcors')
const logger = require('koa-logger')
const jwt = require('koa-jwt')

module.exports = app => cb => {
  try {
    initDoc(app.koa)
    initMiddleware(app.koa)
    console.log('init koa success')
    cb()
  } catch (err) {
    cb(err)
  }

  function initMiddleware (koa) {
    koa.use(cors({maxAge: 3600}))
    koa.use(logger())
    // 所有公开的api 都以 /public 开头
    koa.use(jwt({secret: app.config.jwtSecret, passthrough: true}))
    koa.use(bodyParser())
  }

  function initDoc (koa) {
    if (process.env.NODE_ENV === 'development') {
      // koa.use(require('koa-static')('./docs'))
    }
  }
}
