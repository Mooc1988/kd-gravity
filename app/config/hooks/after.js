/**
 * Created by frank on 2016/12/2.
 */

'use strict'

module.exports = app => cb => {
  let {models, services, config, redis} = app
  app.koa.context.models = models
  app.koa.context.services = services
  app.koa.context.config = config
  app.koa.context.redis = redis
  console.log('execute after hook successfully')
  cb()
}
