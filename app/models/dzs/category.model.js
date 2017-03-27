'use strict'

module.exports = function (sequelize) {
  const {STRING, BOOLEAN} = sequelize.Sequelize
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
    }
  }, {
    classMethods: {
      associate (model) {
        const {DzsCategory, DzsTopic, DzsCategoryTopic} = model
        DzsCategory.belongsToMany(DzsTopic, {through: DzsCategoryTopic})
      }
    },
    tableName: 'dzs_category',
    timestamps: false
  })
}
