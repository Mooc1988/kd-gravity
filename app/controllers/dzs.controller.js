/**
 * Created by frank on 2017/3/20.
 */
const _ = require('lodash')
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
    let {DzsBook} = this.models
    let {name} = this.request.body
    let book = yield DzsBook.find({where: {name}})
    assert(!book, 400, '书籍已经存在')
    book = DzsBook.build(this.request.body)
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

  * findCategories () {
    let {DzsCategory} = this.models
    this.body = yield DzsCategory.findAll()
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
  }
}

function getPage (query) {
  const page = _.get(query, 'page', 1)
  const offset = (page - 1) * LIMIT
  return {offset, limit: LIMIT}
}
