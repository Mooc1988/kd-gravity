'use strict'

module.exports = function (sequelize, DataTypes) {
  const {STRING, BOOLEAN, JSONB, INTEGER} = DataTypes
  return sequelize.define('App', {
    // 名称
    name: {
      type: STRING(128),
      allowNull: false,
      unique: true
    },
    version: {
      type: INTEGER
    },
    recommendLink: {
      type: STRING(256)
    },
    // 审核开关
    auditMode: {
      type: BOOLEAN,
      defaultValue: true
    },
    // 评论开关
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
    state: {
      type: INTEGER,
      defaultValue: 1  // 1使用 0禁用(假删除)
    },
    // app 额外信息
    meta: {
      type: JSONB
    }
  }, {
    defaultScope: {
      where: {
        state: 1
      }
    },
    classMethods: {
      associate ({App, User, YssAlbum, YssAlbumApp, DzsBook, DzsBookshelf, Ad}) {
        App.belongsTo(User)
        App.hasMany(Ad)
        App.belongsToMany(YssAlbum, {
          as: 'Albums',
          through: {model: YssAlbumApp}
        })
        App.belongsToMany(DzsBook, {
          as: 'Books',
          through: {model: DzsBookshelf}
        })
      }
    },
    tableName: 'app'
  })
}
