/**
 * Created by frank on 2017/3/9.
 */

module.exports = {
  ready: true,
  prefix: '/api/wzry',
  routes: [
    {
      method: 'GET',
      path: '/tools',
      handler: 'Wzry.findTools'
    },
    {
      method: 'GET',
      path: '/heroes',
      handler: 'Wzry.findHeroes'
    },
    {
      method: 'GET',
      path: '/heroes/:heroId/page',
      handler: 'Wzry.getHeroPage'
    },
    {
      method: 'GET',
      path: '/categories',
      handler: 'Wzry.findPostCategories'
    },
    {
      method: 'GET',
      path: '/categories/:categoryId/posts',
      handler: 'Wzry.findPostsByCategory'
    },
    {
      method: 'GET',
      path: '/posts/:postId/page',
      handler: 'Wzry.getPostPage'
    },
    {
      method: 'GET',
      path: '/equipments',
      handler: 'Wzry.findEquipments'
    },
    {
      method: 'GET',
      path: '/pages/chuzhuang',
      handler: 'Wzry.getChuzhuangPage'
    },
    {
      method: 'GET',
      path: '/pages/paiqi',
      handler: 'Wzry.getPaiqiPage'
    },
    {
      method: 'GET',
      path: '/equipments/:equipId/page',
      handler: 'Wzry.getEquipPage'
    },
    {
      method: 'GET',
      path: '/heroTags',
      handler: 'Wzry.findHeroTags'
    },
    {
      method: 'GET',
      path: '/equipmentTags',
      handler: 'Wzry.findEquipmentTags'
    },
    {
      method: 'POST',
      path: '/banners',
      handler: 'Wzry.addBanner',
      roles: ['admin']
    },
    {
      method: 'PUT',
      path: '/banners/:bannerId',
      handler: 'Wzry.modifyBanner',
      roles: ['admin']
    },
    {
      method: 'DELETE',
      path: '/banners/:bannerId',
      handler: 'Wzry.removeBannerById',
      roles: ['admin']
    },
    {
      method: 'GET',
      path: '/banners',
      handler: 'Wzry.findBanners'
    },
    {
      method: 'POST',
      path: '/lotteries',
      handler: 'Wzry.getLottery'
    },
    {
      method: 'POST',
      path: '/coupons',
      handler: 'Wzry.addCoupons'
    },
    {
      method: 'GET',
      path: '/coupons',
      handler: 'Wzry.findCoupons'
    },
    {
      method: 'GET',
      path: '/prizeRecords/me',
      handler: 'Wzry.getMyRecords'
    },
    {
      method: 'PUT',
      path: '/addLotteryTimes',
      handler: 'Wzry.addLotteryTimes'
    },
    {
      method: 'GET',
      path: '/recentRecords',
      handler: 'Wzry.getRecentRecords'
    },
    {
      method: 'GET',
      path: '/lotteries/me',
      handler: 'Wzry.getUserInfo'
    },
    {
      method: 'PUT',
      path: '/lotteries/me',
      handler: 'Wzry.finishUserInfo'
    }
  ]
}
