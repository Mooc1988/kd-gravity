/**
 * Created by frank on 2017/4/7.
 */
/**
 * Created by frank on 2017/3/9.
 */

module.exports = {
  ready: true,
  prefix: '/api',
  routes: [
    {
      method: 'GET',
      path: '/templates',
      handler: 'Ad.getTemplates'
    },
    {
      method: 'GET',
      path: '/templates/:templateId',
      handler: 'Ad.getTemplateById'
    },
    {
      method: 'PUT',
      path: '/templates/:templateId',
      handler: 'Ad.modifyTemplateById'
    },
    {
      method: 'POST',
      path: '/users/:userId/templates',
      handler: 'Ad.addAdTemplate',
      roles: ['admin']
    }
  ]
}
