'use strict'

module.exports = function (sequelize) {
  const {INTEGER} = sequelize.Sequelize
  return sequelize.define('DzsCategoryTopic', {
    // 排序
    order: {
      type: INTEGER.UNSIGNED,
      defaultValue: 1
    }
  }, {
    tableName: 'dzs_category_topic'
  })
}
