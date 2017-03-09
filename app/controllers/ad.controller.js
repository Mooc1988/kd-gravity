/**
 * Created by frank on 2017/3/9.
 */
const _ = require('lodash')
const assert = require('lodash')

module.exports = {
  * getAdsByApp () {
    let {appId} = this.params
    let {App} = this.models
    let app = yield App.findById(appId, {attributes: ['id', 'name', 'enableComment', 'meta']})
    assert(app, 400, `app不存在:[${appId}]`)
    let ads = yield app.getAds({attributes: {exclude: ['UserId', 'AppId']}})
    ads = _.keyBy(ads, ad => ad.position)
    this.body = {app, ads}
  },

  * createAd () {
    let {appId} = this.params
    const data = this.request.body
    let {App, Ad} = this.models
    let app = yield App.findById(appId)
    assert(app, 400, `app不存在:[${appId}]`)
    let ad = Ad.build(data)
    ad.AppId = appId
    this.body = yield ad.save()
  },

  * modifyAdById () {
    const {adId} = this.params
    const {Ad} = this.models
    const ad = yield Ad.findById(adId)
    assert(ad, 400, `广告单元不存在:[${adId}]`)
    let data = this.request.body
    _.assign(ad, data)
    this.body = yield ad.save()
  },

  * deleteAdById () {
    const {adId} = this.params
    let {Ad} = this.models
    yield Ad.destroy({where: {id: adId}})
    this.status = 201
  }

}
