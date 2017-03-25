'use strict'

module.exports = function (sequelize) {
  const {STRING, INTEGER, ARRAY, TEXT} = sequelize.Sequelize
  return sequelize.define('DzsBook', {
    uid: {
      type: STRING(128),
      allowNull: false,
      unique: true
    },
    // 名称
    title: {
      type: STRING(128),
      allowNull: false
    },
    // 作者
    author: {
      type: STRING(30)
    },
    // 简介
    brief: {
      type: TEXT
    },
    coverImage: {
      type: STRING(512)
    },
    tags: {
      type: ARRAY(STRING(128))
    },

    // 章节数量
    chapterCount: {
      type: INTEGER,
      defaultValue: 0
    },
    // 阅读量
    viewCount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0
    },
    // 下载量
    downloadCount: {
      type: INTEGER.UNSIGNED,
      defaultValue: 0
    },
    // 1：完成 0: 未完成
    state: {
      type: INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate (model) {
        let {DzsBook, DzsCategory, App, DzsBookshelf} = model
        DzsBook.belongsToMany(App, {through: DzsBookshelf})
        DzsBook.belongsTo(DzsCategory)
      }
    },
    tableName: 'dzs_book',
    timestamps: false
  })
}
