/**
 * Created by frank on 2017/3/9.
 */
const _ = require('lodash')
const assert = require('http-assert')

module.exports = {

  // 过去APP 列表
  * list () {
    let {App, User} = this.models
    let include = [{
      model: User,
      attributes: ['id', 'username', 'nickname']
    }]
    let order = [['createdAt', 'DESC']]
    let cond = _.assign({include, order, offset: 0, limit: 20}, this.query)
    this.body = yield App.findAndCountAll(cond)
  },

  // 创建APP信息,并且根据广告模版自动填充广告
  * create () {
    const {App, AdTemplate, Ad} = this.models
    const {APP_TYPES} = this.config
    const {user} = this.state
    const UserId = user.id
    let {type, name} = this.request.body
    assert(_.indexOf(APP_TYPES, type) > 0, 400, `支持的APP类型:[ ${APP_TYPES} ]`)
    let app = App.build({type, name, UserId})
    let at = yield AdTemplate.find({where: {type, UserId}})
    assert(at, 400, '先创建广告模版才能创建APP')
    app = yield app.save()
    let {ads} = at
    _.forEach(ads, ad => { ad.AppId = app.id })
    yield Ad.bulkCreate(ads)
    ads = yield app.getAds({attributes: {exclude: ['UserId', 'AppId']}})
    this.body = {app, ads}
  },

  // 修改APP信息
  * modifyById () {
    const {appId} = this.params
    let data = this.request.body
    let {App} = this.models
    let app = yield App.findById(appId)
    assert(app, 400, `app不存在${appId}`)
    _.assign(app, data)
    this.body = yield app.save()
  }
}
