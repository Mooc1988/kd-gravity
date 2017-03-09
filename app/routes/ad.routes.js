/**
 * Created by frank on 2017/3/10.
 */

module.exports = {
  ready: true,
  prefix: '/api',
  routes: [
    {
      method: 'GET',
      path: '/apps/:appId/ads',
      handler: 'Ad.getAdsByApp'
    },
    {
      method: 'POST',
      path: '/apps/:appId/ads',
      handler: 'Ad.createAd'
    },
    {
      method: 'PUT',
      path: '/ads/:adId',
      handler: 'Ad.modifyAdById'
    },
    {
      method: 'DELETE',
      path: '/ads/:adId',
      handler: 'Ad.deleteAdById'
    }
  ]
}
