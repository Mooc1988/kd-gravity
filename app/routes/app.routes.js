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
      handler: 'App.list'
    },
    {
      method: 'POST',
      path: '/',
      handler: 'App.create'
    },
    {
      method: 'PUT',
      path: '/:appId',
      handler: 'App.modifyById'
    }
  ]
}
