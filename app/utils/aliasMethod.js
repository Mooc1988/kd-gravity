/**
 * Created by frank on 2017/6/7.
 */

const _ = require('lodash')
const Random = require('random-js')

const random = new Random(Random.engines.mt19937().autoSeed())
const randomIntGen = (min, max) => () => random.integer(min, max)
const randomValueGen = (min, max) => () => random.real(min, max)

/**
 *
 * alias method 随机概率算法实现
 * 参考 http://www.keithschwarz.com/darts-dice-coins/
 *
 */
class AliasMethodSample {
  constructor (weights) {
    if (!_.isArray(weights) || _.isEmpty(weights)) {
      throw new Error('weights must be a none empty array')
    }
    let sum = _.sum(weights)
    this.length = weights.length
    this.alias = new Array(this.length)
    this.probabilities = _.map(weights, w => w / sum)
    this.ramdomInt = randomIntGen(0, this.length - 1)
    this.randomValue = randomValueGen(0, 1)
    this._init()
  }

  _init () {
    let average = 1.0 / this.length
    let small = []
    let large = []
    this.probabilities.forEach((v, index) => {
      if (v >= average) {
        large.push(index)
      } else {
        small.push(index)
      }
    })
    while (small.length > 0 && large.length > 0) {
      let less = small.pop()
      let more = large.pop()
      this.probabilities[more] = this.probabilities[more] + this.probabilities[less] - average
      this.probabilities[less] = this.probabilities[less] * this.length
      this.alias[less] = more
      if (this.probabilities[more] >= average) {
        large.push(more)
      } else {
        small.push(more)
      }
    }
    while (small.length > 0) {
      this.probabilities[small.pop()] = 1.0
    }
    while (large.length > 0) {
      this.probabilities[large.pop()] = 1.0
    }
  }

  next () {
    let currentIndex = this.ramdomInt()
    let currentNumber = this.randomValue()
    if (currentNumber < this.probabilities[currentIndex]) return currentIndex
    return this.alias[currentIndex]
  }
}

module.exports = AliasMethodSample
