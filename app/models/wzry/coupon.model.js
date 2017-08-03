/**
 * Created by frank on 2017/7/30.
 */
/**
 * Created by frank on 2017/4/13.
 */
'use strict'

module.exports = function (sequelize) {
  const {STRING, INTEGER, JSONB, BOOLEAN} = sequelize.Sequelize
  return sequelize.define('Coupon', {
    cType: {
      type: STRING,
      defaultValue: 'cdKey'
    },
    prizeCode: {
      type: INTEGER
    },
    data: {
      type: JSONB
    },
    used: {
      type: BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'wzry_coupon'
  })
}
