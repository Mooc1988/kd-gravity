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
      path: '/categories/:categoryId(\\d+)/books',
      handler: 'Dzs.findBooksByCategory'
    },
    {
      method: 'GET',
      path: '/apps/:appId(\\d+)/books',
      handler: 'Dzs.findBooksByApp'
    },
    {
      method: 'GET',
      path: '/categories',
      handler: 'Dzs.findCategories'
    },
    {
      method: 'POST',
      path: '/apps/:appId(\\d+)/books',
      handler: 'Dzs.addToApp',
      roles: ['admin', 'publisher']
    },
    {
      method: 'PUT',
      path: '/books/:bookId/viewCount',
      handler: 'Dzs.increaseViewCount'
    }
  ]
}
