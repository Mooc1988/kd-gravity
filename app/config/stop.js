/**
 * Created by frank on 2016/12/5.
 */

const chalk = require('chalk')

module.exports = function stop (err) {
    if (err) {
        console.error(chalk.red(err))
    }
    process.exit(0)
    this.emit('stop')
}
