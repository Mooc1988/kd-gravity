'use strict'
// 声音模型
module.exports = function (sequelize, DataTypes) {
  const {STRING, INTEGER} = DataTypes
  return sequelize.define('YssSound', {
    id: {
      type: INTEGER,
      primaryKey: true
    },
    // 名称
    title: {
      type: STRING(128),
      allowNull: false
    },
    url: {
      type: STRING(512),
      allowNull: false
    },
    // 阅读量
    playCount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0
    },

    duration: {
      type: INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    classMethods: {
      associate ({YssSound, YssAlbum}) {
        YssSound.belongsTo(YssAlbum)
      }
    },
    tableName: 'yss_sound',
    timestamps: false
  })
}
