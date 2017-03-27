/**
 * Created by frank on 2017/3/21.
 */
/**
 * Created by frank on 2017/3/12.
 */

module.exports = {
  ready: true,
  prefix: '/api/dzs',
  routes: [
    {
      method: 'GET',
      path: '/books',
      handler: 'Dzs.findBooks'
    },
    {
      method: 'GET',
      path: '/categories',
      handler: 'Dzs.findCategories'
    },
    {
      method: 'POST',
      path: '/apps/:appId(\\d+)/books',
      handler: 'Dzs.addToApp'
    }
  ]
}
