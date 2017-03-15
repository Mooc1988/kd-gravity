'use strict'

module.exports = function (sequelize, DataTypes) {
  const {STRING, BOOLEAN, JSONB} = DataTypes
  return sequelize.define('App', {
    // 名称
    name: {
      type: STRING(128),
      allowNull: false,
      unique: true
    },
    // 评价开关
    enableComment: {
      type: BOOLEAN,
      defaultValue: false
    },
    // 类型
    type: {
      type: STRING(128),
      allowNull: false
    },
    subType: {
      type: STRING(128)
    },
    // app 额外信息
    meta: {
      type: JSONB
    }
  }, {
    classMethods: {
      associate ({App, User, YssAlbum, YssAlbumApp, Ad}) {
        App.belongsTo(User)
        App.hasMany(Ad)
        App.belongsToMany(YssAlbum, {
          as: 'Albums',
          through: {model: YssAlbumApp}
        })
      }
    },
    tableName: 'app'
  })
}
