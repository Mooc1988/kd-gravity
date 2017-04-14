'use strict'

module.exports = function (sequelize) {
  const {STRING, BOOLEAN, ARRAY, INTEGER} = sequelize.Sequelize
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
    // 每个分类的精选书籍
    previews: {
      type: ARRAY(INTEGER)
    }
  }, {
    classMethods: {
      associate (model) {
        const {DzsCategory, DzsBook, DzsTopic, DzsCategoryTopic} = model
        DzsCategory.belongsToMany(DzsTopic, {through: DzsCategoryTopic})
        DzsCategory.hasMany(DzsBook)
      }
    },
    tableName: 'dzs_category',
    timestamps: false
  })
}
