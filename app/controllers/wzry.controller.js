/**
 * Created by frank on 2017/4/5.
 */
const _ = require('lodash')
const assert = require('http-assert')
const request = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const minify = require('html-minifier').minify

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
  },

  * getHeroPage () {
    let {heroId} = this.params
    let cacheKey = `wzry:hero:${heroId}`
    let data = yield this.redis.get(cacheKey)
    let {WzryHero} = this.models
    if (!data) {
      let hero = yield WzryHero.findById(heroId)
      assert(hero, 400, 'hero不存在')
      let {link} = hero
      data = yield fetchHeroOrEquipPage(link)
      yield this.redis.set(cacheKey, data)
    }
    this.body = data
  },

  * getEquipPage () {
    let {equipId} = this.params
    let cacheKey = `wzry:equip:${equipId}`
    let data = yield this.redis.get(cacheKey)
    let {WzryEquipment} = this.models
    if (!data) {
      let equip = yield WzryEquipment.findById(equipId)
      assert(equip, 400, 'equip不存在')
      let {link} = equip
      data = yield fetchHeroOrEquipPage(link)
      yield this.redis.set(cacheKey, data)
    }
    this.body = data
  }
}

function fetchHeroOrEquipPage (uri) {
  const converterStream = iconv.decodeStream('GBK')
  request.get({uri, encoding: null}).pipe(converterStream)
  return new Promise(function (resolve, reject) {
    converterStream.collect(function (err, body) {
      if (err) {
        return reject(err)
      }
      let $ = cheerio.load(body)
      _.forEach(['script', 'center', '.mt8', '.wzny-logo'], e => $(e).remove())
      _.forEach($('#strategyDetailPage').children('div'), (d) => {
        if (!$(d).hasClass('content')) {
          $(d).remove()
        }
      })
      let result = minify($.html(), {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true
      })
      resolve(result)
    })
  })
}
