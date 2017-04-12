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
      handler: 'Template.getTemplates'
    },
    {
      method: 'GET',
      path: '/users/:userId/templates',
      handler: 'Template.getUserTemplates'
    },
    {
      method: 'GET',
      path: '/templates/:templateId(\\d+)',
      handler: 'Template.getTemplateById'
    },
    {
      method: 'GET',
      path: '/templates/positions',
      handler: 'Template.getPositionsOfType'
    },
    {
      method: 'PUT',
      path: '/templates/:templateId',
      handler: 'Template.modifyTemplateById',
      roles: ['admin']
    },
    {
      method: 'POST',
      path: '/users/:userId/templates',
      handler: 'Template.addTemplate',
      roles: ['admin']
    }
  ]
}
