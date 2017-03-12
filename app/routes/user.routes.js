/**
 * Created by frank on 2017/3/12.
 */

module.exports = {
  ready: true,
  prefix: '/api',
  routes: [
    {
      method: 'POST',
      path: '/register',
      handler: 'User.register'
    },
    {
      method: 'POST',
      path: '/login',
      handler: 'User.login'
    },
    {
      method: 'GET',
      path: '/users',
      roles: ['admin'],
      handler: 'User.findAll'
    }]
}
