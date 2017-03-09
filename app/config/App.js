/**
 * Created by frank on 2016/11/1.
 */

'use strict'

const http = require('http')
const {EventEmitter} = require('events')

// 单例模式
let _instance = null

class App extends EventEmitter {

  constructor () {
    super()
    if (!_instance) {
      _instance = this
    }
    this.setMaxListeners(0)
    this.koa = require('koa')()
    this.server = new http.Server(this.koa.callback())
    return _instance
  }

  init (cb) {
    require('./init').apply(this, [cb])
  }

  start () {
    require('./start').apply(this)
  }

  stop (err) {
    require('./stop').apply(this, [err])
  }
}

module.exports = new App()
