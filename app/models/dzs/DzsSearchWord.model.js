'use strict'
// 分类模型
module.exports = function (sequelize, DataTypes) {
  const {STRING, INTEGER} = DataTypes
  return sequelize.define('DzsSearchWord', {
    // 搜索关键词
    keyword: {
      type: STRING(128),
      allowNull: false,
      unique: true
    },
    // 开启
    count: {
      type: INTEGER,
      defaultValue: 1
    }
  }, {
    indexes: [{
      method: 'BTREE',
      fields: ['keyword']
    }],
    tableName: 'dzs_search_word',
    timestamps: false
  })
}
