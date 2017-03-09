/**
 * Created by frank on 2016/12/1.
 */
/**
 * Created by frank on 2016/11/30.
 */

'use strict'
const path = require('path')
const glob = require('glob')
const chalk = require('chalk')

let environmentFiles = glob.sync(path.resolve(__dirname, `./${process.env.NODE_ENV}.js`))
if (!environmentFiles.length) {
  if (process.env.NODE_ENV) {
    console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'))
  } else {
    console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'))
  }
  process.env.NODE_ENV = 'development'
}
const defaultConfig = require('./default')
const envConfig = require(`./${process.env.NODE_ENV}.js`)

module.exports = Object.assign({}, require('../../../package.json'), defaultConfig, envConfig)

