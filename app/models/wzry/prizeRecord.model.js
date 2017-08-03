/**
 * Created by frank on 2017/4/13.
 */
'use strict'

module.exports = function (sequelize) {
  const {STRING, INTEGER, JSONB} = sequelize.Sequelize
  return sequelize.define('PrizeRecord', {
    deviceId: {
      type: STRING,
      allowNull: false
    },
    prizeCode: {
      type: INTEGER
    },
    username: {
      type: STRING
    },
    prize: {
      type: STRING
    },
    data: {
      type: JSONB
    }
  }, {
    tableName: 'wzry_prize_record',
    indexes: [{fields: ['deviceId']}]
  })
}
