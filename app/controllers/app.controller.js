/**
 * Created by frank on 2017/3/9.
 */
const _ = require('lodash')
const assert = require('http-assert')
const LIMIT = 50

module.exports = {

  // 获取APP 列表
  * list () {
    let {App, User} = this.models
    let include = [{
      model: User,
      attributes: ['id', 'username', 'nickname']
    }]
    const order = [['createdAt', 'DESC']]
    const where = getQuery(this.query)
    let {search} = this.query
    if (!_.isEmpty(search)) {
      where.name = {$like: `%${search}%`}
    }
    const {offset, limit} = getPage(this.query)
    const cond = {include, order, offset, limit, where}
    this.body = yield App.findAndCountAll(cond)
  },
  // 创建APP信息,并且根据广告模版自动填充广告
  * create () {
    const {App, AdTemplate, Ad} = this.models
    const {user} = this.state
    const UserId = user.id
    let {type, name, subType} = this.request.body
    if (type === '游戏') {
      assert(subType, 400, '游戏类型必须填写子类型')
    }
    let where = {type, UserId}
    if (subType) {
      where.subType = subType
    }
    let template = yield AdTemplate.findOne({where})
    assert(template, 400, '先创建广告模版')
    let app = App.build({type, name, UserId, subType})
    _.assign(app, _.pick(template, ['recommendLink', 'meta', 'version']))
    app = yield app.save()
    let {ads} = template
    _.forEach(ads, ad => { ad.AppId = app.id })
    yield Ad.bulkCreate(ads)
    ads = yield app.getAds({attributes: {exclude: ['UserId', 'AppId']}})
    this.body = {app, ads}
  },

  // 修改APP信息
  * modifyById () {
    const {appId} = this.params
    let cacheKey = makeCacheKey(appId)
    let data = this.request.body
    let {App} = this.models
    let app = yield App.findById(appId)
    assert(app, 400, `app不存在${appId}`)
    _.assign(app, data)
    yield app.save()
    try {
      yield this.redis.del(cacheKey)
    } catch (err) {
      console.error(err)
    }
    this.body = app
  },

  // 假删除
  * deleteById () {
    let {appId} = this.params
    let {App} = this.models
    yield App.update({state: 0}, {where: {id: appId}})
    this.status = 201
  },

  * switchAuditMode () {
    let {appId} = this.params
    let cacheKey = makeCacheKey(appId)
    let {App} = this.models
    let app = yield App.findById(appId)
    assert(app, 400, `app不存在${appId}`)
    let {auditMode} = app
    app.auditMode = !auditMode
    yield app.save()
    try {
      yield this.redis.del(cacheKey)
    } catch (err) {
      console.error(err)
    }
    this.status = 201
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

function makeCacheKey (appId) {
  return `ad:${appId}`
}