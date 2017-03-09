/**
 * Created by frank on 2016/12/2.
 */

'use strict'

module.exports = app => cb => {
  let {models, services, config} = app
  app.koa.context.models = models
  app.koa.context.services = services
  app.koa.context.config = config
  console.log('execute after hook successfully')
  cb()
}
