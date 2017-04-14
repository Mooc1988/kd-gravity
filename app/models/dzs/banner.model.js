/**
 * Created by frank on 2017/4/13.
 */
'use strict'

module.exports = function (sequelize) {
  const {STRING, BOOLEAN, JSONB} = sequelize.Sequelize
  return sequelize.define('DzsBanner', {
    // 名称
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
    data: {
      type: JSONB,
      allowNull: false
    }
  }, {
    tableName: 'dzs_banner',
    timestamps: false
  })
}
