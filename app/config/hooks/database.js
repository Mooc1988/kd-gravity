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
    fs.readdirSync(MODEL_PATH)
      .forEach(function (file) {
        const model = seq.import(path.join(MODEL_PATH, file))
        models[model.name] = model
      })

    Object.keys(models).forEach(function (modelName) {
      if ('associate' in models[modelName]) {
        models[modelName].associate(models)
      }
    })
    seq.sync()
    app.models = models
    console.log('init database and models successfully')
    cb()
  } catch (err) {
    cb(err)
  }
}
