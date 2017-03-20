'use strict'

module.exports = function (sequelize) {
  const {STRING, INTEGER} = sequelize.Sequelize
  return sequelize.define('DzsBook', {
    // 名称
    name: {
      type: STRING(128),
      allowNull: false,
      unique: true
    },
    // 作者
    author: {
      type: STRING(30)
    },
    // 简介
    brief: {
      type: STRING(2048)
    },
    // 阅读量
    pv: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0
    },
    // 下载量
    downloadCount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate (model) {
        let {DzsBook, DzsCategory, App, DzsBookshelf} = model
        DzsBook.belongsToMany(App, {through: DzsBookshelf})
        DzsCategory.belongsTo(DzsCategory)
      }
    },
    tableName: 'dzs_book'
  })
}
