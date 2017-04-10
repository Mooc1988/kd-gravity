/**
 * Created by frank on 2017/3/10.
 */

module.exports = {
  ready: true,
  prefix: '/api',
  routes: [
    {
      method: 'GET',
      path: '/apps/:appId(\\d+)/ads',
      handler: 'Ad.getAdsByApp'
    },
    {
      method: 'POST',
      path: '/apps/:appId(\\d+)/ads',
      handler: 'Ad.batchAddAds',
      roles: ['admin']
    },
    {
      method: 'PUT',
      path: '/ads/batch',
      handler: 'Ad.batchModifyAds',
      roles: ['admin']
    },
    {
      method: 'PUT',
      path: '/ads/:adId(\\d+)',
      handler: 'Ad.modifyAdById',
      roles: ['admin']
    },
    {
      method: 'DELETE',
      path: '/ads/:adId(\\d+)',
      handler: 'Ad.deleteAdById',
      roles: ['admin']
    }
  ]
}
