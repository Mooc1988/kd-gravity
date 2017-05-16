/**
 * Created by frank on 2017/3/9.
 */

module.exports = {
  ready: true,
  prefix: '/api/yss',
  routes: [
    {
      method: 'GET',
      path: '/apps/:appId(\\d+)/albums',
      handler: 'Yss.findAlbumsByApp'
    },
    {
      method: 'GET',
      path: '/categories',
      handler: 'Yss.findCategories'
    },
    {
      method: 'GET',
      path: '/categories/:categoryId([a-zA-Z0-9]+)/albums',
      handler: 'Yss.findAlbumsByCategory'
    },
    {
      method: 'GET',
      path: '/albums',
      handler: 'Yss.findAlbums'
    },
    {
      method: 'PUT',
      path: '/albums/:albumId(\\d+)',
      handler: 'Yss.modifyAlbumById'
    },
    {
      method: 'GET',
      path: '/albums/:albumId(\\d+)/sounds',
      handler: 'Yss.findSoundsByAlbum'
    },
    {
      method: 'GET',
      path: '/albums/search',
      handler: 'Yss.searchByName'
    },
    {
      method: 'GET',
      path: '/hotKeywords',
      handler: 'Yss.findHotKeywords'
    },
    {
      method: 'POST',
      path: '/apps/:appId(\\d+)/albums',
      handler: 'Yss.addToApp'
    },
    {
      method: 'DELETE',
      path: '/apps/:appId(\\d+)/albums/:albumId(\\d+)',
      handler: 'Yss.removeFromApp'
    },
    {
      method: 'POST',
      path: '/banners',
      handler: 'Yss.addBanner',
      roles: ['admin']
    },
    {
      method: 'PUT',
      path: '/banners/:bannerId',
      handler: 'Yss.modifyBanner',
      roles: ['admin']
    },
    {
      method: 'DELETE',
      path: '/banners/:bannerId',
      handler: 'Yss.removeBannerById',
      roles: ['admin']
    },
    {
      method: 'GET',
      path: '/banners',
      handler: 'Yss.findBanners'
    },
    {
      method: 'POST',
      path: '/tops',
      handler: 'Yss.createTop',
      roles: ['admin']
    },
    {
      method: 'PUT',
      path: '/tops/:topId',
      handler: 'Yss.modifyTopById',
      roles: ['admin']
    },
    {
      method: 'GET',
      path: '/tops/:topId',
      handler: 'Yss.getTopById'
    },
    {
      method: 'GET',
      path: '/tops/all',
      handler: 'Yss.findAllTops'
    },
    {
      method: 'GET',
      path: '/tops',
      handler: 'Yss.getTopsByIds'
    }
  ]
}
