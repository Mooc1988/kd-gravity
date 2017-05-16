/**
 * Created by frank on 2017/3/9.
 */
const _ = require('lodash')
const assert = require('http-assert')
const sequelize = require('sequelize')
const LIMIT = 30
module.exports = {

  * findAlbumsByApp () {
    const {appId} = this.params
    let {App} = this.models
    let app = yield App.findById(appId)
    assert(app, 400, `app不存在:[${appId}]`)
    this.body = yield app.getAlbums()
  },

  * addToApp () {
    const {appId} = this.params
    const {albumIds} = this.request.body
    let {App, YssAlbum} = this.models
    let albums = yield YssAlbum.findAll({where: {id: {$in: albumIds}}})
    assert(!_.isEmpty(albums), 400, `albums 不存在:[${albumIds}]`)
    let app = yield App.findById(appId)
    assert(app, 400, `app 不存在:[${appId}]`)
    assert(app.type === '有声书', 400, 'app类型必须为[有声书]')
    yield app.addAlbums(albums)
    this.body = yield app.getAlbums()
  },

  * removeFromApp () {
    const {albumId, appId} = this.params
    let {YssAlbumApp} = this.models
    yield YssAlbumApp.destroy({
      where: {YssAlbumId: albumId, AppId: appId}
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
    const page = _.get(this.query, 'page', 1)
    const offset = (page - 1) * LIMIT
    let cond = _.assign({
      offset,
      limit: LIMIT,
      where: {YssCategoryId: categoryId}
    }, this.query)
    this.body = yield YssAlbum.findAndCountAll(cond)
  },

  * findSoundsByAlbum () {
    const {albumId} = this.params
    const page = _.get(this.query, 'page', 1)
    const offset = (page - 1) * LIMIT
    const condition = _.assign({
      offset,
      limit: LIMIT,
      order: ['id'],
      where: {YssAlbumId: albumId}
    }, this.query)
    const {YssSound} = this.models
    this.body = yield YssSound.findAndCountAll(condition)
  },

  * findAlbums () {
    let {YssAlbum, YssCategory} = this.models
    let include = [{
      model: YssCategory,
      attributes: ['id', 'title']
    }]
    const where = getQuery(this.query)
    let {search} = this.query
    if (!_.isEmpty(search)) {
      where.$or = [
        {title: {$like: `%${search}%`}},
        {tags: {$contains: [search]}}
      ]
    }
    const {offset, limit} = getPage(this.query)
    const cond = {include, offset, limit, where}
    this.body = yield YssAlbum.findAndCountAll(cond)
  },

  * searchByName () {
    let {keyword} = this.query
    assert(!_.isEmpty(keyword), 400, '请填写关键词')
    let {YssAlbum, YssSearchWord} = this.models
    keyword = _.trim(keyword)
    const page = _.get(this.query, 'page', 1)
    const offset = (page - 1) * LIMIT
    const condition = {
      offset,
      limit: LIMIT,
      where: {title: {$like: `%${keyword}%`}}
    }
    YssSearchWord.find({where: {keyword}}).then(function (record) {
      if (record) return record.increment({count: 1})
      return YssSearchWord.create({keyword})
    })
    this.body = yield YssAlbum.findAndCountAll(condition)
  },

  * findHotKeywords () {
    let {YssSearchWord} = this.models
    let words = yield YssSearchWord.findAll({order: [['count', 'DESC']], limit: 15})
    this.body = _.map(words, w => w.keyword)
  },

  * modifyAlbumById () {
    let {YssAlbum} = this.models
    let {albumId} = this.params
    let {title} = this.request.body
    let album = yield YssAlbum.findById(albumId)
    assert(album, 400, '专辑不存在')
    this.body = yield album.update({title})
  },
  // 创建榜单
  * createTop () {
    let {YssTop} = this.models
    let top = YssTop.build(this.request.body)
    this.body = yield top.save()
  },

  // 修改榜单信息
  * modifyTopById () {
    let {YssTop} = this.models
    let {topId} = this.params
    let top = yield YssTop.findById(topId)
    assert(top, 400, '榜单不存在')
    _.assign(top, this.request.body)
    this.body = yield top.save()
  },

  // 获取榜单信息
  * getTopById () {
    let {YssTop, YssAlbum} = this.models
    let {topId} = this.params
    let top = yield YssTop.findById(topId)
    assert(top, 400, '榜单不存在')
    let {albums} = top
    if (!_.isEmpty(albums)) {
      let bs = yield YssAlbum.findAll({where: {id: {$in: albums}}})
      bs = _.sortBy(bs, b => albums.indexOf(b.id))
      top.albums = bs
    }
    this.body = top
  },

  // 获取所有榜单
  * findAllTops () {
    let {YssTop} = this.models
    this.body = yield YssTop.findAll()
  },

  * getTopsByIds () {
    let {ids} = this.query
    assert(ids, 400, '必须提供ids')
    ids = _.map(ids.split(','), id => parseInt(id))
    let {YssTop, YssAlbum} = this.models
    let tops = yield YssTop.findAll({where: {id: {$in: ids}}})
    for (let top of tops) {
      top = top.toJSON()
      let ids = _.sampleSize(top.albums, 4)
      delete top['albums']
      top.previews = yield YssAlbum.findAll({where: {id: {$in: ids}}})
    }
    this.body = tops
  },

  * addBanner () {
    let {YssBanner} = this.models
    let banner = YssBanner.build(this.request.body)
    this.body = yield banner.save()
  },

  * modifyBanner () {
    let {YssBanner} = this.models
    let {bannerId} = this.params
    let banner = yield YssBanner.findById(bannerId)
    assert(banner, 400, 'banner不存在')
    _.assign(banner, this.request.body)
    this.body = yield banner.save()
  },

  * removeBannerById () {
    let {YssBanner} = this.models
    let {bannerId} = this.params
    let banner = yield YssBanner.findById(bannerId)
    assert(banner, 400, 'banner不存在')
    yield banner.destroy()
    this.status = 201
  },

  * findBanners () {
    let {YssBanner} = this.models
    this.body = yield YssBanner.findAll({
      order: [sequelize.fn('random')],
      limit: 4
    })
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
