/**
 * Created by frank on 2017/4/11.
 */
const _ = require('lodash')
const assert = require('http-assert')
const LIMIT = 30

module.exports = {
  * addTemplate () {
    const {userId} = this.params
    const {APP_TYPES} = this.config
    const {type} = this.request.body
    assert(_.indexOf(APP_TYPES, type) >= 0, 400, `支持的APP类型:[ ${APP_TYPES} ]`)
    const {AdTemplate, User} = this.models
    let user = yield User.findById(userId)
    assert(user, 400, '用户不存在')
    let at = yield AdTemplate.find({where: {type, UserId: userId}})
    assert(!at, 400, `该用户在[${type}] 下已经存在模版`)
    at = AdTemplate.build(this.request.body)
    at.UserId = userId
    this.body = yield at.save()
  },

  * getTemplates () {
    const {AdTemplate, User} = this.models
    let include = [{
      model: User,
      attributes: ['id', 'nickname']
    }]
    const {offset, limit} = getPage(this.query)
    let where = getQuery(this.query)
    this.body = yield AdTemplate.findAndCountAll({include, where, limit, offset})
  },

  * getTemplateById () {
    const {AdTemplate, User} = this.models
    let {templateId} = this.params
    let include = [{
      model: User,
      attributes: ['id', 'nickname']
    }]
    this.body = yield AdTemplate.findById(templateId, {include})
  },

  * modifyTemplateById () {
    let {AdTemplate} = this.models
    let {templateId} = this.params
    let template = yield AdTemplate.findById(templateId)
    assert(template, 400, '模版不存在')
    let {upgrade} = this.request.body
    if (upgrade) {
      let {version, type, UserId} = template
      let data = template.toJSON()
      let newTemplate = AdTemplate.build(_.omit(data, 'id'))
      let newVersion = version + 1
      let count = yield AdTemplate.count({where: {type, UserId, version: newVersion}})
      assert(count === 0, 400, '该模版已经升级')
      newTemplate.version = newVersion
      newTemplate.enable = true
      template.enable = false
      yield template.save()
      this.body = yield newTemplate.save()
    } else {
      _.assign(template, _.omit(this.request.body))
      this.body = yield template.save()
    }
  },

  * getPositionsOfType () {
    let {type} = this.query
    assert(type, 400, '必须提供App类型')
    const {APP_TYPES} = this.config
    assert(_.indexOf(APP_TYPES, type) >= 0, 400, `支持的APP类型:[ ${APP_TYPES} ]`)
    let {AdTemplate} = this.models
    let template = yield AdTemplate.find({where: {type}})
    let positions = []
    if (template) {
      let {ads} = template
      positions = _.map(ads, ad => {
        let {name, position} = ad
        return {name, position}
      })
    }
    this.body = positions
  },

  * getUserTemplates () {
    let {userId} = this.params
    let {type} = this.query
    assert(type, 400, '必须提供类型')
    let {AdTemplate} = this.models
    this.body = yield AdTemplate.findAll({where: {type, UserId: userId}})
  }

}

function getPage (query) {
  const page = _.get(query, 'page', 1)
  const offset = (page - 1) * LIMIT
  return {offset, limit: LIMIT}
}

function getQuery (query) {
  return _.omitBy(_.omit(query, ['page', 'search']), _.isEmpty)
}
