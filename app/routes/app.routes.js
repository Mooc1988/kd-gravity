/**
 * Created by frank on 2017/3/9.
 */

module.exports = {
  ready: true,
  prefix: '/api/apps',
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'App.list',
      roles: ['publisher', 'admin']
    },
    {
      method: 'POST',
      path: '/',
      handler: 'App.create',
      roles: ['publisher', 'admin']
    },
    {
      method: 'PUT',
      path: '/:appId',
      handler: 'App.modifyById',
      roles: ['publisher', 'admin']
    },
    {
      method: 'DELETE',
      path: '/:appId',
      handler: 'App.deleteById',
      roles: ['publisher', 'admin']
    }
  ]
}
