'use strict'

module.exports = function (sequelize) {
  const {STRING, BOOLEAN, INTEGER} = sequelize.Sequelize
  return sequelize.define('DzsCategory', {
    // 名称
    name: {
      type: STRING(128),
      allowNull: false,
      unique: true
    },
    // 开启
    enable: {
      type: BOOLEAN,
      defaultValue: true
    },
    // 标识符, 指定特殊的分类
    key: {
      type: STRING(128),
      defaultValue: 'general'
    },
    // 排序
    order: {
      type: INTEGER.UNSIGNED,
      defaultValue: 1
    }
  }, {
    classMethods: {
      associate (model) {
        const {DzsCategory, DzsTopic, DzsBook, DzsCategoryTopic} = model
        DzsCategory.belongsToMany(DzsTopic, {through: DzsCategoryTopic})
        DzsCategory.hasMany(DzsBook)
      }
    },
    tableName: 'dzs_category'
  })
}
