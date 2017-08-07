/**
 * Created by frank on 2017/8/5.
 */
const _ = require('lodash')
const assert = require('http-assert')

module.exports = {

  *createBanner (){
    let {PromoteBanner, App} = this.models
    let {appId} = this.params
    let app = yield App.findById(appId)
    assert(app, 400, 'app not found')
    let banner = PromoteBanner.build(this.request.body)
    banner.AppId = app.id
    this.body = yield banner.save()
  },

  *modifyBanner (){
    let {PromoteBanner} = this.models
    let {bannerId} = this.params
    let banner = yield PromoteBanner.findById(bannerId)
    assert(banner, 400, 'banner not found')
    _.assign(banner, this.request.body)
    this.body = yield banner.save()
  },

  * deleteBanner (){
    let {PromoteBanner} = this.models
    let {bannerId} = this.params
    let banner = yield PromoteBanner.findById(bannerId)
    assert(banner, 400, 'banner not found')
    this.body = yield banner.destroy()
  },

  * findBanners (){
    let {appId} = this.params
    let {PromoteBanner} = this.models
    this.body = yield PromoteBanner.findAll({where: {AppId: appId}})
  },

  *createProduct (){
    let {PromoteProduct, App} = this.models
    let {appId} = this.params
    let app = yield App.findById(appId)
    assert(app, 400, 'app not found')
    let banner = PromoteProduct.build(this.request.body)
    banner.AppId = app.id
    this.body = yield banner.save()
  },

  *modifyProduct (){
    let {PromoteProduct} = this.models
    let {productId} = this.params
    let banner = yield PromoteProduct.findById(productId)
    assert(banner, 400, 'banner not found')
    _.assign(banner, this.request.body)
    this.body = yield banner.save()
  },

  * deleteProduct (){
    let {PromoteProduct} = this.models
    let {productId} = this.params
    let banner = yield PromoteProduct.findById(productId)
    assert(banner, 400, 'banner not found')
    this.body = yield banner.destroy()
  },

  * findProducts (){
    let {appId} = this.params
    let {PromoteProduct} = this.models
    let order = [['id', 'ASC']]
    this.body = yield PromoteProduct.findAll({order, where: {AppId: appId}})
  }
}