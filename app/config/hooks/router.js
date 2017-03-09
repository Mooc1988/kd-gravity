/**
 * Created by frank on 2016/11/29.
 */

const _ = require('lodash')
const Router = require('koa-joi-router')
const chalk = require('chalk')
const {isGeneratorFunction, isValidateVerb} = require('../../utils/validator')
const acl = require('../../middlewares/acl')
const errorHandler = require('../../middlewares/errorHandler')

module.exports = app => cb => {
  let rootRouter = Router()
  try {
    app.koa.use(errorHandler)
    loadRouter(app.routes, rootRouter)
    app.koa.use(rootRouter.middleware())
    app.router = rootRouter
    console.log('init routers success')
    cb()
  } catch (err) {
    cb(err)
  }

  function loadRouter (routes, rootRouter) {
    loadRecurse(routes)
    function loadRecurse (routes, parent) {
      _.forEach(routes, (routeConfig, name) => {
        let fullName = parent ? `${parent}.${name}` : name
        if (name.indexOf('routes') >= 0) {
          if (routeConfig.ready) {
            try {
              rootRouter.use(doLoad(routeConfig).middleware())
            } catch (err) {
              console.error(chalk.red(`load api [${fullName}] failed: ${err.message || ''}`))
              throw err
            }
          }
        } else if (typeof routeConfig === 'object') {
          loadRecurse(routeConfig, fullName)
        }
      })
    }
  }

  function doLoad (api) {
    let {prefix, routes} = api
    if (!routes || !_.isArray(routes)) {
      throw new Error('api must has routes property')
    }
    let router = new Router()
    if (_.isString(prefix) && !_.isEmpty(prefix)) {
      if (prefix.indexOf('/') !== 0) {
        throw new Error(`prefix must begin with '/'`)
      }
      router.prefix(prefix)
    }
    _.forEach(routes, config => router.route(routerChecker(config, api)))
    return router
  }

// 解析route配置
  function routerChecker (routeConfig, api) {
    if (_.isEmpty(_.get(routeConfig, 'method')) || _.isEmpty(_.get(routeConfig, 'path'))) {
      throw new Error('route must has method and path')
    }
    let {method, path, handler, roles} = routeConfig
    // 验证http method
    if (!isValidateVerb(method)) {
      throw new Error(`UnSupported http verb: ${method}`)
    }
    let handlerChain = parseHandler(handler)
    // 如果route有roles配置,根据角色添加acl中间件
    roles = roles || []
    if (!_.isEmpty(api.roles)) {
      roles = _.uniq([...roles, ...api.roles])
    }
    if (!_.isEmpty(roles)) {
      handlerChain = [acl.generateAcl(roles), ...handlerChain]
    }
    return {method, path, handler: handlerChain}
  }

// 解析handler
  function parseHandler (handler) {
    const handlerChain = _.isArray(handler) ? handler : [handler]
    return _.map(handlerChain, function _parse (handler) {
      let action = handler
      let actionFun = _.isString(action) ? _.get(app.controllers, action) : action
      if (!actionFun) {
        throw new Error(`handler [ ${action} ] not found`)
      }
      if (!isGeneratorFunction(actionFun)) {
        throw new Error(`handler [ ${action} ] must be a generator function`)
      }
      return actionFun
    })
  }
}
