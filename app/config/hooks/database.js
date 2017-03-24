/**
 * Created by frank on 2017/3/9.
 */
'use strict'
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

module.exports = app => cb => {
  const MODEL_PATH = path.resolve(__dirname, '../../models')
  try {
    const {database, username, password, config} = app.config.db
    const models = {}
    const seq = new Sequelize(database, username, password, config)
    // 优化成递归注册model
    fs.readdirSync(MODEL_PATH)
      .forEach(function (file) {
        const filePath = path.join(MODEL_PATH, file)
        if (file.indexOf('js') < 0) {
          fs.readdirSync(filePath).forEach(function (file) {
            const model = seq.import(path.join(filePath, file))
            models[model.name] = model
          })
        } else {
          const model = seq.import(path.join(MODEL_PATH, file))
          models[model.name] = model
        }
      })

    Object.keys(models).forEach(function (modelName) {
      if ('associate' in models[modelName]) {
        models[modelName].associate(models)
      }
    })

    if (process.env.NODE_ENV === 'development') {
      seq.sync()
    }
    // 里面禁止修改
    if (process.env.NODE_ENV === 'production') {
      seq.sync()
    }
    app.models = models
    console.log('init database and models successfully')
    cb()
  } catch (err) {
    cb(err)
  }
}
