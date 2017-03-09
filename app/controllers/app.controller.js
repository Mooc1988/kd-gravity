/**
 * Created by frank on 2017/3/9.
 */
const _ = require('lodash')
const assert = require('http-assert')

module.exports = {

  * list () {
    let {App} = this.models
    let cond = _.assign({offset: 0, limit: 20}, this.query)
    this.body = yield App.findAndCountAll(cond)
  },

  * create () {
    const {App} = this.models
    let app = App.build(this.request.body)
    this.body = yield app.save()
  },

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
