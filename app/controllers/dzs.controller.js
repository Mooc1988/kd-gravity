/**
 * Created by frank on 2017/3/20.
 */
const _ = require('lodash')
const sequelize = require('sequelize')
const assert = require('http-assert')

const LIMIT = 30

module.exports = {
  // 根据appId获取图书列表
  * findBooksByApp () {
    const {appId} = this.params
    let {App} = this.models
    let app = yield App.findById(appId)
    assert(app, 400, `app不存在:[${appId}]`)
    this.body = yield app.getBooks()
  },
  // 添加书籍
  * addBook () {
    let {DzsBook, DzsCategory} = this.models
    let {title, uid, categoryId} = this.request.body
    let book = yield DzsBook.find({where: {$or: [{title}, {uid}]}})
    assert(!book, 400, '名称或uid重复')
    let category = yield DzsCategory.findById(categoryId, {attributes: ['name']})
    assert(category, 400, '分类不存在')
    book = DzsBook.build(this.request.body)
    book.DzsCategoryId = categoryId
    book.tags = [category.name]
    book.coverImage = `https://book.hizuoye.com/books/${uid}/cover.jpg`
    book.state = 1
    this.body = yield book.save()
  },

  // 获取图书列表,支持分页和搜索
  * findBooks () {
    let {DzsBook, DzsSearchWord} = this.models
    const {offset, limit} = getPage(this.query)
    const {keyword, tag, category} = this.query
    let where = {}
    if (!_.isEmpty(tag)) {
      const tags = tag.split(',')
      where.tags = {$contains: tags}
    }
    if (!_.isEmpty(category)) {
      where.DzsCategoryId = category
    }
    if (!_.isEmpty(keyword)) {
      where.$or = [{title: {$like: `%${keyword}%`}}, {author: {$like: `%${keyword}%`}}]
      DzsSearchWord.find({where: {keyword}}).then(function (record) {
        if (record) return record.increment({count: 1})
        return DzsSearchWord.create({keyword})
      })
    }
    const cond = {where, offset, limit}
    this.body = yield DzsBook.findAndCountAll(cond)
  },

  * findBookById () {
    let {DzsBook} = this.models
    let {bookId} = this.params
    this.body = yield DzsBook.findById(bookId)
  },

  * findCategories () {
    let {DzsCategory} = this.models
    this.body = yield DzsCategory.findAll()
  },

  * findCategoryById () {
    let cacheKey = 'category:preview'
    let {DzsCategory} = this.models
    let {categoryId} = this.params
    let cate = yield DzsCategory.findById(categoryId)
    assert(cate, 400, '分类不存在')
    let previews = yield this.redis.hget(cacheKey, categoryId)
    if (previews) {
      cate.previews = JSON.parse(previews)
    }
    this.body = cate
  },

  * findCategoriesWithPreview () {
    let cacheKey = 'category:preview'
    let {redis} = this
    let {DzsCategory, DzsBook} = this.models
    let categories = yield DzsCategory.findAll()
    try {
      let data = yield redis.hgetall(cacheKey)
      for (let cate of categories) {
        let previews = data[cate.id]
        if (previews) {
          cate.previews = JSON.parse(previews)
        } else {
          let books = yield DzsBook.findAll({where: {id: {$in: cate.previews}}})
          books = _.sortBy(books, b => cate.previews.indexOf(b.id))
          cate.previews = books
          redis.hset(cacheKey, cate.id, JSON.stringify(books))
        }
      }
    } catch (err) {
      console.log(err)
    }
    this.body = categories
  },

  * modifyCategoryById () {
    let cacheKey = 'category:preview'
    let {DzsCategory, DzsBook} = this.models
    let {redis} = this
    let {categoryId} = this.params
    let cate = yield DzsCategory.findById(categoryId)
    assert(cate, 400, '分类不存在')
    _.assign(cate, this.request.body)
    let {previews} = this.request.body
    if (!_.isEmpty(previews)) {
      let books = yield DzsBook.findAll({
        where: {id: {$in: previews}},
        attributes: ['id', 'uid', 'title', 'author', 'brief', 'coverImage']
      })
      books = _.sortBy(books, b => previews.indexOf(b.id))
      try {
        let cacheData = JSON.stringify(books)
        yield redis.hset(cacheKey, categoryId, cacheData)
      } catch (err) {
        console.err(err)
      }
    }
    this.body = yield cate.save()
  },

  * findBooksByCategory () {
    let {categoryId} = this.params
    let {DzsBook} = this.models
    const {offset, limit} = getPage(this.query)
    let cond = _.assign({
      offset,
      limit,
      where: {DzsCategoryId: categoryId}
    }, this.query)
    this.body = yield DzsBook.findAndCountAll(cond)
  },

  // 修改指定图书
  * modifyBookById () {
    let {DzsBook} = this.models
    let {bookId} = this.params
    let book = yield DzsBook.findById(bookId)
    assert(book, 400, '图书不存在或已删除')
    _.assign(book, this.request.body)
    this.body = yield book.save()
  },

  // 添加进书架
  * addToApp () {
    const {appId} = this.params
    const {bookIds} = this.request.body
    let {App, DzsBook} = this.models
    let books = yield DzsBook.findAll({where: {id: {$in: bookIds}}})
    assert(!_.isEmpty(books), 400, `books 不存在:[${bookIds}]`)
    let app = yield App.findById(appId)
    assert(app, 400, `app 不存在:[${appId}]`)
    assert(app.type === '电子书', 400, 'app类型必须为[电子书]')
    yield app.addBooks(books)
    this.body = yield app.getBooks()
  },

  // 从书架删除
  * removeFromBookshelf () {
    const {bookId, appId} = this.params
    let {DzsBookshelf} = this.models
    yield DzsBookshelf.destroy({
      where: {DzsBookId: bookId, AppId: appId}
    })
    this.status = 201
  },

  * increaseViewCount () {
    let {DzsBook} = this.models
    let {bookId} = this.params
    DzsBook.find({where: {id: bookId}}).then(function (record) {
      if (record) return record.increment({viewCount: 1})
    })
    this.status = 201
  },

  * topN () {
    let cacheKey = 'books:top20'
    let {category} = this.query
    let {DzsBook} = this.models
    let where = {}
    let limit = 20
    if (!_.isEmpty(category)) {
      where.DzsCategoryId = category
      cacheKey = `books:top:categories:${category}`
    }
    let order = [['viewCount', 'DESC']]
    let attributes = ['id', 'title', 'coverImage', 'viewCount', 'author', 'brief', 'uid']
    let cacheData
    try {
      cacheData = yield this.redis.get(cacheKey)
    } catch (err) {
      console.error(err)
    }
    if (cacheData) {
      this.body = JSON.parse(cacheData)
    } else {
      let books = yield DzsBook.findAll({where, order, attributes, limit})
      try {
        let EX = 60 * 60 * 12  // 12 hours
        yield this.redis.set(cacheKey, JSON.stringify(books), 'EX', EX)
      } catch (err) {
        console.error(err)
      }
      this.body = books
    }
  },

  * addBanner () {
    let {DzsBanner} = this.models
    let banner = DzsBanner.build(this.request.body)
    this.body = yield banner.save()
  },

  * modifyBanner () {
    let {DzsBanner} = this.models
    let {bannerId} = this.params
    let banner = yield DzsBanner.findById(bannerId)
    assert(banner, 400, 'banner不存在')
    _.assign(banner, this.request.body)
    this.body = yield banner.save()
  },

  * removeBannerById () {
    let {DzsBanner} = this.models
    let {bannerId} = this.params
    let banner = yield DzsBanner.findById(bannerId)
    assert(banner, 400, 'banner不存在')
    yield banner.destroy()
    this.status = 201
  },

  * findBanners () {
    let {DzsBanner} = this.models
    this.body = yield DzsBanner.findAll({
      order: [sequelize.fn('random')],
      limit: 4
    })
  },

  // 创建榜单
  * createTop () {
    let {DzsTop} = this.models
    let top = DzsTop.build(this.request.body)
    this.body = yield top.save()
  },

  // 修改榜单信息
  * modifyTopById () {
    let {DzsTop} = this.models
    let {topId} = this.params
    let top = yield DzsTop.findById(topId)
    assert(top, 400, '榜单不存在')
    _.assign(top, this.request.body)
    this.body = yield top.save()
  },

  // 获取榜单信息
  * getTopById () {
    let {DzsTop, DzsBook} = this.models
    let {topId} = this.params
    let top = yield DzsTop.findById(topId)
    assert(top, 400, '榜单不存在')
    let {books} = top
    if (!_.isEmpty(books)) {
      let attributes = ['id', 'title', 'coverImage', 'author', 'brief', 'uid']
      let bs = yield DzsBook.findAll({where: {id: {$in: books}}, attributes})
      bs = _.sortBy(bs, b => books.indexOf(b.id))
      top.books = bs
    }
    this.body = top
  },

  // 获取所有榜单
  * findAllTops () {
    let {DzsTop} = this.models
    this.body = yield DzsTop.findAll()
  },

  * getTopsByIds () {
    let {ids} = this.query
    assert(ids, 400, '必须提供ids')
    ids = _.map(ids.split(','), id => parseInt(id))
    let {DzsTop, DzsBook} = this.models
    let tops = yield DzsTop.findAll({where: {id: {$in: ids}}})
    for (let top of tops) {
      top = top.toJSON()
      let books = _.sampleSize(top.books, 4)
      delete top['books']
      let attributes = ['id', 'title', 'coverImage', 'author', 'brief', 'uid']
      top.previews = yield DzsBook.findAll({where: {id: {$in: books}}, attributes})
    }
    this.body = tops
  }
}

function getPage (query) {
  const page = _.get(query, 'page', 1)
  const offset = (page - 1) * LIMIT
  return {offset, limit: LIMIT}
}
