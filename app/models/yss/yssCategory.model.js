'use strict'
// 分类模型
module.exports = function (sequelize, DataTypes) {
  const {STRING, BOOLEAN, INTEGER} = DataTypes
  return sequelize.define('YssCategory', {
    id: {
      primaryKey: true,
      type: STRING(128)
    },
    // 专题名称
    title: {
      type: STRING(128),
      allowNull: false,
      unique: true
    },
    // 开启
    enable: {
      type: BOOLEAN,
      defaultValue: true
    },
    // 排序
    order: {
      type: INTEGER.UNSIGNED,
      defaultValue: 1
    }
  }, {
    classMethods: {
      associate ({YssCategory, YssAlbum}) {
        YssCategory.hasMany(YssAlbum)
      }
    },
    tableName: 'yss_category',
    timestamps: false
  })
}
