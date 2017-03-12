/**
 * Created by frank on 2017/3/12.
 */

module.exports = {
  // 注册
  * register () {
    let {username, password} = this.request.body
    let {User} = this.models
    let user = yield User.find({where: {username}})
    if (user) {
      this.throw(400, `该用户名已存在`)
    }
    user = User.build(this.request.body)
    user.salt = Date.now().toString()
    user.password = user.hashPassword(password)
    yield user.save()
    this.body = {username, password}
  },
  // 登陆
  * login () {
    let {username, password} = this.request.body
    let {User} = this.models
    let {Jwt} = this.services
    let user = yield User.find({where: {username}})
    if (!user || !user.authenticate(password)) {
      this.throw(400, '用户名或密码错误')
    }
    let {id, role} = user
    let token = Jwt.sign({id, username, role})
    this.body = {token}
  },

  * findAll () {
    let {User} = this.models
    this.body = yield User.findAll({attributes: {exclude: ['password', 'salt']}})
  }
}
