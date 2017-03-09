/**
 * Created by frank on 2016/12/1.
 */

'use strict'

module.exports = app => cb => {
  try {
    app.config = require('../env/index')
    console.log('init config successfully')
    cb()
  } catch (err) {
    cb(err)
  }
}
