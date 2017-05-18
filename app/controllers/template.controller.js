/**
 * Created by frank on 2017/4/11.
 */
const _ = require('lodash')
const assert = require('http-assert')
const LIMIT = 30

module.exports = {
  * addTemplate () {
    const {user} = this.state
    const {APP_TYPES} = this.config
    const {AdTemplate} = this.models
    const {name, type, subType, UserId} = this.request.body
    let count = yield AdTemplate.count({where: {name}})
    assert(count === 0, 400, '模版名称已存在')
    assert(UserId, 400, '缺少UserId')
    assert(_.indexOf(APP_TYPES, type) >= 0, 400, `支持的APP类型:[ ${APP_TYPES} ]`)
    let where = {UserId: user.id, type}
    if (type === '游戏') {
      assert(subType, 400, '游戏类型APP模版需要自类型')
      where.subType = subType
    }
    count = yield AdTemplate.count({where})
    assert(count === 0, 400, '该类型模版已经存在')
    let at = AdTemplate.build(this.request.body)
    at.UserId = user.id
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

  * upgradeTemplateById () {
    let {AdTemplate} = this.models
    let {templateId} = this.params
    let template = yield AdTemplate.findById(templateId)
    assert(template, 400, '模版不存在')
    let {version, type, UserId, subType} = template
    let data = template.toJSON()
    let newTemplate = AdTemplate.build(_.omit(data, 'id'))
    let newVersion = version + 1
    let where = {type, UserId, version: newVersion}
    if (subType) {
      where.subType = subType
    }
    let count = yield AdTemplate.count({where})
    assert(count === 0, 400, '该模版已经升级')
    newTemplate.version = newVersion
    newTemplate.enable = true
    template.enable = false
    yield template.save()
    yield newTemplate.save()
    this.body = newTemplate
  },

  * modifyTemplateById () {
    let {AdTemplate} = this.models
    let {templateId} = this.params
    let template = yield AdTemplate.findById(templateId)
    assert(template, 400, '模版不存在')
    _.assign(template, this.request.body)
    this.body = yield template.save()
  },

  * getUserTemplates () {
    let {type, subType, UserId} = this.query
    assert(type, 400, '必须提供类型')
    assert(UserId, 400, '必须提供用户ID')
    let where = {UserId, type}
    if (subType) {
      where.subType = subType
    }
    let {AdTemplate} = this.models
    this.body = yield AdTemplate.scope(null).findAll({where})
  },

  * getSubTypes () {
    let {AdTemplate} = this.models
    let templates = yield AdTemplate.findAll({where: {type: '游戏'}, attributes: ['subType']})
    let subTypes = []
    _.forEach(templates, t => {
      if (t.subType) {
        subTypes.push(t.subType)
      }
    })
    this.body = _.uniq(subTypes)
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
