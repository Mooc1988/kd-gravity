/**
 * Created by frank on 2016/12/5.
 */
const async = require('async')
const router = require('./hooks/router')
const directory = require('./hooks/directory')
const config = require('./hooks/config')
const redis = require('./hooks/redis')
const koa = require('./hooks/koa')
const after = require('./hooks/after')
const database = require('./hooks/database')

module.exports = function init (done) {
  global.App = this
  async.series([
    cb => config(this)(cb),     // 加载配置文件
    cb => redis(this)(cb),     // 加载配置文件
    cb => database(this)(cb),   // 初始化数据库
    cb => koa(this)(cb),        // 设置koa
    cb => directory(this)(cb),  // 加载 models services controllers routes
    cb => router(this)(cb),     // 加载路由
    cb => after(this)(cb)
  ], done)
}
