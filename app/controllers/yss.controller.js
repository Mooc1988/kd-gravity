/**
 * Created by frank on 2017/3/9.
 */
const _ = require('lodash')
const assert = require('http-assert')
module.exports = {

  * findAlbumsByApp () {
    const {appId} = this.params
    let {App} = this.models
    let app = yield App.findById(appId)
    assert(app, 400, `app不存在:[${appId}]`)
    this.body = yield app.getAlbums()
  },

  * addToApp () {
    const {albumId, appId} = this.params
    let {App, YssAlbum} = this.models
    let album = yield YssAlbum.findById(albumId)
    assert(album, 400, `album 不存在:[${albumId}]`)
    let app = yield App.findById(appId)
    assert(app, 400, `app 不存在:[${appId}]`)
    yield app.addAlbum(album)
    this.status = 201
  },

  * removeFromApp () {
    const {albumId, appId} = this.params
    let {AlbumApp} = this.models
    yield AlbumApp.destroy({
      where: {yssAlbumId: albumId, appId: appId}
    })
    this.status = 201
  },

  * findCategories () {
    const {YssCategory} = this.models
    this.body = yield YssCategory.findAll({order: [['order', 'DESC']]})
  },

  * findAlbumsByCategory () {
    const {categoryId} = this.params
    let {YssAlbum} = this.models
    let cond = _.assign({
      offset: 0,
      limit: 20,
      order: [['order', 'DESC']],
      where: {
        YssCategoryId: categoryId
      }
    }, this.query)
    this.body = yield YssAlbum.findAndCountAll(cond)
  },

  * findSoundsByAlbum () {
    const {albumId} = this.params
    const condition = _.assign({
      offset: 0,
      limit: 20,
      order: ['id'],
      where: {YssAlbumId: albumId}
    }, this.query)
    const {YssSound} = this.models
    this.body = yield YssSound.findAndCountAll(condition)
  }
}
