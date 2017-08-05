/**
 * Created by frank on 2017/8/5.
 */
'use strict'
module.exports = function (sequelize) {
  const {STRING, BOOLEAN, JSONB, ARRAY} = sequelize.Sequelize
  return sequelize.define('PromoteProduct', {
    title: {
      type: STRING,
      allowNull: false
    },
    desc: {
      type: STRING,
      allowNull: false
    },
    meta: {
      type: JSONB
    },
    // 图片
    image: {
      type: STRING(128),
      allowNull: false
    },
    // 开启
    enable: {
      type: BOOLEAN,
      defaultValue: true
    },
    // 类型 book or app
    type: {
      type: STRING(128),
      allowNull: false
    },
    tags: {
      type: ARRAY(STRING)
    },
    data: {
      type: JSONB,
      allowNull: false
    }
  }, {
    tableName: 'promote_product',
    classMethods: {
      associate (model) {
        let {App, PromoteProduct} = model
        PromoteProduct.belongsTo(App)
      }
    },
    timestamps: false
  })
}
