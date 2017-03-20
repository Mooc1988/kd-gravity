'use strict'

module.exports = function (sequelize) {
  const {STRING, BOOLEAN, INTEGER} = sequelize.Sequelize
  return sequelize.define('DzsTopic', {
    // 专题名称
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
    // 排序
    order: {
      type: INTEGER.UNSIGNED,
      defaultValue: 1
    }
  }, {
    classMethods: {
      associate ({DzsCategory, DzsTopic, DzsCategoryTopic}) {
        DzsTopic.belongsToMany(DzsCategory, {through: DzsCategoryTopic})
      }
    },
    tableName: 'dzs_topic'
  })
}
