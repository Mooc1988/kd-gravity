/**
 * Created by frank on 2016/12/5.
 */

'use strict'
const chalk = require('chalk')

module.exports = function start () {
  this.init(err => {
    if (err) {
      return this.stop(err)
    }
    let {config, server} = this
    server.listen(config.port, () => {
      const server = `http://${config.host}:${config.port}`
      console.log('--')
      console.log(chalk.green(`App name:          ${config.name}`))
      console.log(chalk.green(`App version:       ${config.version}`))
      console.log()
      console.log(chalk.green(`Environment:       ${process.env.NODE_ENV}`))
      console.log(chalk.green(`Server:            ${server}`))
      console.log(chalk.green(`Database:          ${config.db.database}`))
      console.log('--')
      this.emit('start')
    })
  })
}



