/**
 * Created by frank on 2016/11/30.
 */

'use strict'

const path = require('path')
const async = require('async')
const _ = require('lodash')
const requireDir = require('../../utils/requireDir')

module.exports = app => cb => {
  async.auto(
    {
      'services': next => {
        requireDir({
          dirPath: path.resolve(__dirname, '../../services'),
          filter: /(.+)\.service\.js$/,
          filenameReplacer: upperFirst,
          depth: 1
        }, next)
      },

      'controllers': next => {
        requireDir({
          dirPath: path.resolve(__dirname, '../../controllers'),
          filter: /(.+)\.controller\.js$/,
          filenameReplacer: upperFirst,
          depth: 1
        }, next)
      },

      'routes': next => {
        requireDir({
          dirPath: path.resolve(__dirname, '../../routes'),
          filter: /(.+)\.routes\.js$/,
          depth: 2
        }, next)
      }
    },
    (err, results) => {
      if (err) return cb(err)
      _.assign(app, results)
      console.log('init directory success')
      cb(null)
    }
  )
}

function upperFirst (name) {
  return _.upperFirst(name.split('.')[0])
}
