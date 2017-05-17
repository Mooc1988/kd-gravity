/**
 * Created by frank on 2017/3/9.
 */

module.exports = {
  ready: true,
  prefix: '/api/templates',
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'Template.getTemplates',
      roles: ['admin']
    },
    {
      method: 'POST',
      path: '/',
      handler: 'Template.addTemplate',
      roles: ['admin']
    },
    {
      method: 'GET',
      path: '/user',
      handler: 'Template.getUserTemplates',
      roles: ['admin']
    },
    {
      method: 'GET',
      path: '/:templateId(\\d+)',
      handler: 'Template.getTemplateById',
      roles: ['publisher', 'admin']
    },
    {
      method: 'PUT',
      path: '/:templateId',
      handler: 'Template.modifyTemplateById',
      roles: ['admin']
    },
    {
      method: 'PUT',
      path: '/:templateId/upgrade',
      handler: 'Template.upgradeTemplateById',
      roles: ['admin']
    },
    {
      method: 'GET',
      path: '/subTypes',
      handler: 'Template.getSubTypes'
    }
  ]
}
