/**
 * Created by frank on 2017/4/5.
 */
const _ = require('lodash')
const moment = require('moment')
const assert = require('http-assert')
const request = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const minify = require('html-minifier').minify
const AliasMethod = require('../utils/aliasMethod')
const LIMIT = 30

const samples = new AliasMethod([970000, 10000, 10000, 5000, 5000, 1, 0])
const PRIZE_CODE = [
  {
    code: '0',
    name: '未中奖'
  }, {
    code: 1001,
    name: '兰陵王3天+刺客信条3天'
  }, {
    code: 1002,
    name: '刘邦3天+圣殿之光3天'
  }, {
    code: 1003,
    name: '貂蝉7天+异域舞娘7天'
  }, {
    code: 1004,
    name: '露娜7天+绯红之刃7天'
  }, {
    code: 1005,
    name: '虞姬永久英雄+加勒比小姐7天'
  }, {
    code: 1006,
    name: ''
  }]

module.exports = {

  * findCoupons () {
    let codes = ['1001', '1002', '1003', '1004', '1005', '1006']
    let ret = {}
    for (let code of codes) {
      let cacheKey = getCacheKey(code)
      ret[code] = yield this.redis.llen(cacheKey)
    }
    this.body = ret
  },
  * addCoupons () {
    let {prizeCode, data} = this.request.body
    assert(prizeCode, 400, 'invalid params')
    assert(data, 400, 'invalid params')
    let cacheKey = getCacheKey(prizeCode)
    let multi = this.redis.multi()
    if (!_.isArray(data)) {
      data = [data]
    }
    _.forEach(data, k => multi.lpush(cacheKey, k))
    yield multi.exec()
    let total = yield this.redis.llen(cacheKey)
    this.body = {
      prizeCode,
      total
    }
  },
  * getUserInfo () {
    let {deviceId} = this.query
    assert(deviceId, 400, 'invalid params')
    let {Lottery} = this.models
    let lottery = yield Lottery.findOne({where: {deviceId}})
    if (!lottery) {
      lottery = Lottery.build({deviceId, times: 3})
      yield lottery.save()
    }
    this.body = lottery
  },

  * finishUserInfo () {
    let {deviceId, username} = this.request.body
    assert(deviceId, 400, 'invalid params')
    assert(username, 400, 'invalid params')
    let {Lottery} = this.models
    let lottery = yield Lottery.findOne({where: {deviceId}})
    assert(lottery, 400, 'lottery not found')
    lottery.username = username
    this.body = yield lottery.save()
  },

  * getLottery () {
    let {deviceId} = this.request.body
    assert(deviceId, 400, 'invalid params')
    let {Lottery, PrizeRecord} = this.models
    let lottery = yield Lottery.findOne({where: {deviceId}})
    assert(lottery, 400, 'invalid params')
    let ret = {award: -1}
    if (lottery.times > 0) {
      lottery.totalTimes += 1
      lottery.times -= 1
      let award = executeAward(lottery)
      if (award > 0) {
        let {name, code} = PRIZE_CODE[award]
        // 如果库存少于3个，则抽不中
        let cacheKey = getCacheKey(code)
        let cdKey = yield this.redis.lpop(cacheKey)
        if (!cdKey) {
          award = 0
        } else {
          let data = {cdKey}
          lottery.winnings += 1
          let record = PrizeRecord.build({deviceId, prize: name, prizeCode: code, data})
          record.username = lottery.username
          yield record.save()
          ret.recordId = record.id
          ret.cdKey = cdKey
        }
      }
      ret.award = award
    }
    yield lottery.save()
    this.body = ret
  },

  * getMyRecords () {
    let {deviceId} = this.query
    assert(deviceId, 400, 'invalid params')
    let {PrizeRecord} = this.models
    this.body = yield PrizeRecord.findAll({where: {deviceId}})
  },

  * addLotteryTimes () {
    let ONE_DAY = 60 * 60 * 24
    let {user} = this.state
    assert(user, 401, 'invalid token')
    let {deviceId} = user
    let date = moment().date()
    let key = `user:${deviceId}:date:${date}`
    let times = yield this.redis.get(key)
    let {Lottery} = this.models
    times = times ? parseInt(times) : 1
    let lottery = yield Lottery.findOne({where: {deviceId}})
    assert(times <= 3, 400, 'beyond max times')
    if (!lottery) {
      lottery = Lottery.build({deviceId, times: 3})
    } else {
      times += 1
      lottery.times += 1
    }
    yield lottery.save()
    yield this.redis.set(key, times, 'EX', ONE_DAY)
    this.body = {times: lottery.times}
  },

  * getRecentRecords () {
    let {limit} = this.query
    limit = limit || 10
    let {PrizeRecord} = this.models
    let attributes = {exclude: ['data', 'prizeCode']}
    let order = [['createdAt', 'DESC']]
    let records = yield PrizeRecord.findAll({attributes, limit, order})
    let ret = []
    _.forEach(records, record => {
      record = record.toJSON()
      let {username} = record
      if (username.length > 4) {
        record.username = '****' + username.substr(4)
      }
      ret.push(record)
    })
    this.body = ret
  },

  * findHeroTags () {
    this.body = ['全部', '坦克', '战士', '刺客', '法师', '射手', '辅助']
  },

  * findEquipmentTags () {
    this.body = ['全部', '攻击', '法术', '防御', '移动', '打野']
  },

  * findPostCategories () {
    this.body = [{id: 1, title: '最新资讯'}, {id: 2, title: '攻略秘籍'}, {id: 3, 'title': '英雄图鉴'}]
  },

  * findTools () {
    this.body = [{
      title: '符文模拟器',
      image: 'https://book.hizuoye.com/images/wzry/fuwen.png',
      link: 'http://www.diyiyou.com/gameweb/3v3/moniqi'
    }, {
      title: '出装模拟器',
      image: 'https://book.hizuoye.com/images/wzry/equment.png',
      link: 'http://gravity.hizuoye.com/api/wzry/pages/chuzhuang'
    }, {
      title: '英雄排期表',
      image: 'https://book.hizuoye.com/images/wzry/hero.png',
      link: 'http://gravity.hizuoye.com/api/wzry/pages/paiqi'
    }]
  },

  * findPostsByCategory () {
    let {categoryId} = this.params
    let {WzryPost} = this.models
    let {offset, limit} = getPage(this.query)
    let cond = {
      where: {category: categoryId},
      attributes: ['id', 'title', 'image', 'createdAt'],
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    }
    this.body = yield WzryPost.findAndCountAll(cond)
  },

  * getPostPage () {
    let {postId} = this.params
    let {WzryPost} = this.models
    let cacheKey = `wzry:post:${postId}`
    let data = yield this.redis.get(cacheKey)
    if (!data) {
      let post = yield WzryPost.findById(postId)
      let {link, source} = post
      assert(post, 400, 'post不存在')
      if (source === 'ptbus') {
        data = yield fetchPtbusPage(link)
      } else if (source === '72g') {
        data = yield fetch72gPage(link)
      }
      yield this.redis.set(cacheKey, data)
    }
    this.body = {html: data}
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
      data = yield fetchHeroPage(link)
      yield this.redis.set(cacheKey, data)
    }
    this.body = {html: data}
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
    this.body = {html: data}
  },
  * getChuzhuangPage () {
    const url = 'http://www.dabiaoge.me/pvp/tool/pvp18183.html'
    let cacheKey = `page:${url}`
    let data = yield this.redis.get(cacheKey)
    if (!data) {
      data = yield fetchChuZhuang(url)
      yield this.redis.set(cacheKey, data)
    }
    this.body = data
  },

  * getPaiqiPage () {
    const url = 'http://m.18183.com/yxzjol/201607/650642.html'
    let cacheKey = `page:${url}`
    let data = yield this.redis.get(cacheKey)
    if (!data) {
      data = yield fetchPaiqi(url)
      yield this.redis.set(cacheKey, data)
    }
    this.body = data
  },
  * addBanner () {
    let {WzryBanner} = this.models
    let banner = WzryBanner.build(this.request.body)
    this.body = yield banner.save()
  },

  * modifyBanner () {
    let {WzryBanner} = this.models
    let {bannerId} = this.params
    let banner = yield WzryBanner.findById(bannerId)
    assert(banner, 400, 'banner不存在')
    _.assign(banner, this.request.body)
    this.body = yield banner.save()
  },

  * removeBannerById () {
    let {WzryBanner} = this.models
    let {bannerId} = this.params
    let banner = yield WzryBanner.findById(bannerId)
    assert(banner, 400, 'banner不存在')
    yield banner.destroy()
    this.status = 201
  },

  * findBanners () {
    let {WzryBanner} = this.models
    this.body = yield WzryBanner.findAll({
      limit: 4
    })
  }
}

function fetchHeroPage (uri) {
  const converterStream = iconv.decodeStream('GBK')
  request.get({uri, encoding: null}).pipe(converterStream)
  return new Promise(function (resolve, reject) {
    converterStream.collect(function (err, body) {
      if (err) {
        return reject(err)
      }
      let $ = cheerio.load(body)
      $('.header').remove()
      $('.srcmenuwp').remove()
      $('.hdimg').remove()
      $('.areahd').remove()
      $('.herobtn').remove()
      $('.bnwrap').remove()
      $('.pinglun').remove()
      $('.footwp').remove()
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

function fetchPtbusPage (uri) {
  return new Promise(function (resolve, reject) {
    request.get(uri, function (err, res, body) {
      if (err) {
        return reject(err)
      }
      let $ = cheerio.load(body)
      $('script').remove()
      _.forEach($('body').children(), (e) => {
        if (e.name !== 'article') {
          $(e).remove()
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

function fetch72gPage (uri) {
  const converterStream = iconv.decodeStream('GBK')
  request.get({uri, encoding: null}).pipe(converterStream)
  return new Promise(function (resolve, reject) {
    converterStream.collect(function (err, body) {
      if (err) {
        return reject(err)
      }
      let $ = cheerio.load(body)
      $('script').remove()
      _.forEach($('head').children('link'), (e) => {
        let link = $(e)
        let href = link.attr('href')
        if (href.startsWith('/')) {
          link.attr('href', `http://m.72g.com${href}`)
        }
      })
      _.forEach($('.wrapper').children(), (e) => {
        let section = $(e)
        if (section.attr('role') !== 'mode-game-infomation') {
          section.remove()
        } else {
          _.forEach(section.children(), (e) => {
            let inner = $(e)
            if (!inner.hasClass('game-article')) {
              inner.remove()
            } else {
              inner.find('table').remove()
            }
          })
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

// 出装模拟器页面
function fetchChuZhuang (url) {
  return new Promise(function (resolve, reject) {
    request.get(url, function (err, res, body) {
      if (err) {
        return reject(err)
      }
      body = body.replace('/home/pvp/pvpzb/', 'http://www.dabiaoge.me/home/pvp/pvpzb')
      body = body.replace('/home/pvp/attribute/', 'http://www.dabiaoge.me/home/pvp/attribute')
      body = body.replace('/home/pvp/heroskill/', 'http://www.dabiaoge.me/home/pvp/heroskill')
      body = body.replace('/home/pvp/hero/', 'http://www.dabiaoge.me/home/pvp/hero')
      body = body.replace('/home/pvp/pvpzbt/type/', 'http://www.dabiaoge.me/home/pvp/pvpzbt/type/')
      let $ = cheerio.load(body)
      $('.header').remove()
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

// 英雄排期页面
function fetchPaiqi (url) {
  return new Promise(function (resolve, reject) {
    request.get(url, function (err, res, body) {
      if (err) {
        return reject(err)
      }
      let $ = cheerio.load(body)
      $('header').remove()
      $('nav').remove()
      $('.m-gift-pack').remove()
      $('body > article > section:nth-child(2)').remove()
      $('#m-cwb-wzry-mobile').remove()
      $('.writer').remove()
      $('body > article > section > h1').text('王者荣耀英雄皮肤上线排期表')
      $('section.re-mod').remove()
      $('.footer').remove()
      $('.mod_download_sup').remove()
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

function getPage (query) {
  const page = _.get(query, 'page', 1)
  const offset = (page - 1) * LIMIT
  return {offset, limit: LIMIT}
}

function executeAward (lottery) {
  let {totalTimes, winnings} = lottery
  if (totalTimes === 20 && winnings === 0) {
    return 1
  }
  if (totalTimes === 50 && winnings === 1) {
    return 2
  }
  return samples.next()
}

function getCacheKey (prizeCode) {
  return `coupon:${prizeCode}`
}
