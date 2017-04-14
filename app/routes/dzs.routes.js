/**
 * Created by frank on 2017/3/21.
 */
/**
 * Created by frank on 2017/3/12.
 */

module.exports = {
  ready: true,
  prefix: '/api/dzs',
  routes: [
    {
      method: 'GET',
      path: '/books',
      handler: 'Dzs.findBooks'
    },
    {
      method: 'GET',
      path: '/books/:bookId',
      handler: 'Dzs.findBookById'
    },
    {
      method: 'GET',
      path: '/books/hot',
      handler: 'Dzs.topN'
    },
    {
      method: 'GET',
      path: '/categories/:categoryId(\\d+)/books',
      handler: 'Dzs.findBooksByCategory'
    },
    {
      method: 'GET',
      path: '/apps/:appId(\\d+)/books',
      handler: 'Dzs.findBooksByApp'
    },
    {
      method: 'GET',
      path: '/categories',
      handler: 'Dzs.findCategories'
    },
    {
      method: 'GET',
      path: '/categoriesWithPreviews',
      handler: 'Dzs.findCategoriesWithPreview'
    },
    {
      method: 'GET',
      path: '/categories/:categoryId',
      handler: 'Dzs.findCategoryById'
    },
    {
      method: 'PUT',
      path: '/categories/:categoryId',
      handler: 'Dzs.modifyCategoryById',
      roles: ['admin']
    },
    {
      method: 'POST',
      path: '/apps/:appId(\\d+)/books',
      handler: 'Dzs.addToApp',
      roles: ['admin', 'publisher']
    },
    {
      method: 'PUT',
      path: '/books/:bookId(\\d+)/viewCount',
      handler: 'Dzs.increaseViewCount'
    },
    {
      method: 'PUT',
      path: '/books/:bookId(\\d+)',
      handler: 'Dzs.modifyBookById',
      roles: ['admin']
    },
    {
      method: 'POST',
      path: '/banners',
      handler: 'Dzs.addBanner',
      roles: ['admin']
    },
    {
      method: 'PUT',
      path: '/banners/:bannerId',
      handler: 'Dzs.modifyBanner',
      roles: ['admin']
    },
    {
      method: 'DELETE',
      path: '/banners/:bannerId',
      handler: 'Dzs.removeBannerById',
      roles: ['admin']
    },
    {
      method: 'GET',
      path: '/banners',
      handler: 'Dzs.findBanners'
    },
    {
      method: 'POST',
      path: '/tops',
      handler: 'Dzs.createTop',
      roles: ['admin']
    },
    {
      method: 'PUT',
      path: '/tops/:topId',
      handler: 'Dzs.modifyTopById',
      roles: ['admin']
    },
    {
      method: 'GET',
      path: '/tops/:topId',
      handler: 'Dzs.getTopById'
    },
    {
      method: 'GET',
      path: '/tops/all',
      handler: 'Dzs.findAllTops'
    },
    {
      method: 'GET',
      path: '/tops',
      handler: 'Dzs.getTopsByIds'
    },
  ]
}
