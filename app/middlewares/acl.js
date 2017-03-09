/**
 * Created by frank on 2016/11/3.
 */
'use strict'

const _ = require('lodash')

const ROLES = new Set([ 'teacher', 'student', 'admin', 'superAdmin', 'shine', 'shadow' ])

/**
 * 根据角色列表生成访问控制中间件
 * @param roles
 * @returns {Function}
 */
module.exports.generateAcl = roles => {
    const rs = _.isArray(roles) ? roles : [ roles ]
    _.forEach(rs, function checkRole (role) {
        if (!ROLES.has(role)) {
            throw new Error(`UnSupported role : ${role}`)
        }
    })

    return function *acl (next) {
        let user = this.state.user
        if (!user) this.throw(401)
        let roles = user.roles || []
        let cannotAccess = _.isEmpty(roles) || _.isEmpty(_.intersection(roles, rs))
        if (cannotAccess) this.throw(403, '用户没有权限访问')
        yield next
    }
}
