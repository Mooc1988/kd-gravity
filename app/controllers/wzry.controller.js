/**
 * Created by frank on 2017/4/5.
 */

module.exports = {
  * findHeroTags () {
    this.body = ['全部', '坦克', '战士', '刺客', '法师', '射手', '辅助']
  },

  * findEquipmentTags () {
    this.body = ['全部', '攻击', '法术', '防御', '移动', '打野']
  },

  * findHeroes () {
    let {WzryHero} = this.models
    this.body = yield WzryHero.findAll({})
  },

  * findEquipments () {
    let {WzryEquipment} = this.models
    this.body = yield WzryEquipment.findAll({})
  }
}
