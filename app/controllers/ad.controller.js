/**
 * Created by frank on 2017/3/9.
 */
const _ = require('lodash')
const assert = require('http-assert')

module.exports = {
  * getAdsByApp () {
    let {appId} = this.params
    let cacheKey = makeCacheKey(appId)
    let cacheData
    try {
      cacheData = yield this.redis.get(cacheKey)
    } catch (err) {
      console.error(err)
    }
    if (cacheData) {
      this.body = JSON.parse(cacheData)
    } else {
      let {App} = this.models
      let app = yield App.findById(appId, {attributes: ['id', 'name', 'auditMode', 'enableComment', 'meta', 'recommendLink']})
      assert(app, 400, `app不存在:[${appId}]`)
      let ads = yield app.getAds({attributes: {exclude: ['UserId', 'AppId']}})
      ads = _.keyBy(ads, ad => ad.position)
      let ret = {app, ads}
      try {
        let ONE_DAY = 60 * 60 * 24
        this.redis.set(cacheKey, JSON.stringify(ret), 'EX', ONE_DAY)
      } catch (err) {
        console.error(err)
      }
      this.body = ret
    }
  },

  * createAd () {
    let {appId} = this.params
    const data = this.request.body
    let {App, Ad} = this.models
    let app = yield App.findById(appId)
    assert(app, 400, `app不存在:[${appId}]`)
    let ad = Ad.build(data)
    ad.AppId = appId
    yield ad.save()
    try {
      let cacheKey = makeCacheKey(appId)
      yield this.redis.del(cacheKey)
    } catch (err) {
      console.error(err)
    }
    this.body = ad
  },

  * batchAddAds () {
    let {appId} = this.params
    let {ads} = this.request.body
    assert(ads, 400, 'ads不能为空')
    ads = _.isArray(ads) ? ads : [ads]
    let {App, Ad} = this.models
    let app = yield App.findById(appId)
    assert(app, 400, `app不存在:[${appId}]`)
    _.forEach(ads, ad => { ad.AppId = appId })
    yield Ad.bulkCreate(ads)
    try {
      let cacheKey = makeCacheKey(appId)
      yield this.redis.del(cacheKey)
    } catch (err) {
      console.error(err)
    }
    this.body = yield app.getAds({attributes: {exclude: ['UserId', 'AppId']}})
  },

  * modifyAdById () {
    const {adId} = this.params
    const {Ad} = this.models
    const ad = yield Ad.findById(adId)
    assert(ad, 400, `广告单元不存在:[${adId}]`)
    let data = this.request.body
    _.assign(ad, data)
    yield ad.save()
    try {
      let cacheKey = makeCacheKey(ad.AppId)
      yield this.redis.del(cacheKey)
    } catch (err) {
      console.error(err)
    }
    this.body = ad
  },

  * deleteAdById () {
    const {adId} = this.params
    let {Ad} = this.models
    let ad = yield Ad.find({where: {id: adId}})
    assert(ad, 400, `广告单元不存在:[${adId}]`)
    let {appId} = ad
    yield ad.destroy()
    try {
      let cacheKey = makeCacheKey(appId)
      yield this.redis.del(cacheKey)
    } catch (err) {
      console.error(err)
    }
    this.status = 201
  },

  // 批量修改广告位
  * batchModifyAds () {
    let {type, subType, UserId, position, ad, version, meta} = this.request.body
    assert(version, 400, '必须提供版本号')
    assert(UserId, 400, '必须提供用户ID')
    let {App, Ad} = this.models
    let condition = {type, version, UserId}
    if (subType) {
      condition.subType = subType
    }
    let apps = yield App.findAll({where: condition, attributes: ['id', 'meta']})
    if (meta && apps) {
      for (let app of apps) {
        app.meta = _.assign(app.meta, meta)
        yield app.save()
      }
    }
    if (position && ad) {
      let ids = _.map(apps, a => a.id)
      assert(!_.isEmpty(ids), 400, '没有符合要求的app')
      ad = _.pick(ad, ['custom', 'showType', 'baidu', 'google', 'chartbox', 'meta', 'enable'])
      let where = {position, AppId: {$in: ids}}
      yield Ad.update(ad, {where})
    }
    // 清理缓存
    let keys = _.map(apps, app => makeCacheKey(app.id))
    let redis = this.redis
    _.forEach(keys, key => {
      redis.del(key).catch(err => console.error(err))
    })
    this.body = 'ok'
  }
}

function makeCacheKey (appId) {
  return `ad:${appId}`
}
