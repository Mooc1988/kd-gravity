/**
 * Created by frank on 2016/11/3.
 */

const _ = require('lodash')

const VERB_EXP = /^(all|get|post|put|delete|trace|options|connect|patch|head|redirect)$/i
const PHONE_EXP = /^[1][0-9]{10}$/
const EMAIL_EXP = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/
const OID_EXP = /^[0-9a-fA-F]{24}$/

module.exports = {

    isGeneratorFunction (obj) {
        const constructor = obj.constructor
        if (!constructor) return false
        if (constructor.name === 'GeneratorFunction' || constructor.displayName === 'GeneratorFunction') return true
        return typeof obj.next === 'function' && typeof obj.throw === 'function'
    },

    isValidateVerb (verbs) {
        if (!_.isString(verbs) && !_.isArray(verbs)) {
            throw new TypeError('verb must be a string or a string array')
        }
        if (_.isEmpty(verbs)) {
            throw new Error('verb must not be empty')
        }
        verbs = _.isArray(verbs) ? verbs : [ verbs ]
        return _.every(verbs, verb => VERB_EXP.test(verb))
    },

    isPhone (phoneNum) {
        if (!phoneNum || !_.isString(phoneNum)) return false
        return PHONE_EXP.test(phoneNum)
    },

    isEmail (email) {
        if (!email || !_.isString(email)) return false
        return EMAIL_EXP.test(email)
    },

    isObjectIdString (id) {
        if (_.isEmpty(id) || !_.isString(id)) return false
        return OID_EXP.test(id)
    }
}
