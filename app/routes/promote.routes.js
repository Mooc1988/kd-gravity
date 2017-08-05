/**
 * Created by frank on 2017/8/5.
 */


module.exports = {
  ready: true,
  prefix: '/api/promotes',
  routes: [
    {
      method: 'POST',
      path: '/apps/:appId/banners',
      handler: 'Promote.createBanner',
    },
    {
      method: 'PUT',
      path: '/banners/:bannerId',
      handler: 'Promote.modifyBanner',
    },
    {
      method: 'DELETE',
      path: '/banners/:bannerId',
      handler: 'Promote.deleteBanner',
    },
    {
      method: 'GET',
      path: '/apps/:appId/banners',
      handler: 'Promote.findBanners',
    },

    {
      method: 'POST',
      path: '/apps/:appId/products',
      handler: 'Promote.createProduct',
    },
    {
      method: 'PUT',
      path: '/products/:productId',
      handler: 'Promote.modifyProduct',
    },
    {
      method: 'DELETE',
      path: '/products/:productId',
      handler: 'Promote.deleteProduct',
    },
    {
      method: 'GET',
      path: '/apps/:appId/products',
      handler: 'Promote.findProducts',
    }
  ]
}
