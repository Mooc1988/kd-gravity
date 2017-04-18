/**
 * Created by frank on 2017/3/9.
 */

module.exports = {
  ready: true,
  prefix: '/api/wzry',
  routes: [
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
      path: '/equipments',
      handler: 'Wzry.findEquipments'
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
    }
  ]
}
