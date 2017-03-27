/**
 * Created by frank on 2017/3/9.
 */

module.exports = {
  ready: true,
  prefix: '/public',
  routes: [
    {
      method: 'GET',
      path: '/ping',
      handler: function * () { this.body = '-' }
    }
  ]
}
