'use strict'

module.exports = function (sequelize, DataTypes) {
  const {STRING} = DataTypes
  return sequelize.define('User', {
    // 用户名
    username: {
      type: STRING(128),
      allowNull: false,
      unique: true
    },
    // 密码
    password: {
      type: STRING(128),
      allowNull: false
    },
    salt: {
      type: STRING(256),
      allowNull: false
    },
    // 姓名
    nickname: {
      type: STRING(128)
    },
    // 角色
    role: {
      type: STRING(128)
    }
  }, {
    tableName: 'user'
  })
}