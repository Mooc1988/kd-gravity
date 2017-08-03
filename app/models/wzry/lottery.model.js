/**
 * Created by frank on 2017/4/13.
 */
'use strict'

module.exports = function (sequelize) {
  const {STRING, INTEGER} = sequelize.Sequelize
  return sequelize.define('Lottery', {
    deviceId: {
      type: STRING,
      allowNull: false
    },
    username: {
      type: STRING
    },
    times: {
      type: INTEGER,
      defaultValue: 3
    },
    totalTimes: {
      type: INTEGER,
      defaultValue: 0
    },
    winnings: {
      type: INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'wzry_lottery',
    indexes: [{unique: true, fields: ['deviceId']}]
  })
}
