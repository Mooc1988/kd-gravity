/**
 * Created by frank on 2017/8/5.
 */
'use strict'
module.exports = function (sequelize) {
  const {STRING, BOOLEAN, JSONB} = sequelize.Sequelize
  return sequelize.define('PromoteBanner', {
    // 名称
    title: {
      type: STRING,
      allowNull: false
    },
    // 图片
    image: {
      type: STRING(128),
      allowNull: false
    },
    meta: {
      type: JSONB
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
    data: {
      type: JSONB,
      allowNull: false
    }
  }, {
    tableName: 'promote_banner',
    classMethods: {
      associate (model) {
        let {App, PromoteBanner} = model
        PromoteBanner.belongsTo(App)
      }
    },
    timestamps: false
  })
}
