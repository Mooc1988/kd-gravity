/**
 * Created by frank on 2017/4/13.
 */
'use strict'

module.exports = function (sequelize) {
  const {STRING, INTEGER, ARRAY} = sequelize.Sequelize
  return sequelize.define('YssTop', {
    name: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    image: {
      type: STRING
    },
    albums: {
      type: ARRAY(INTEGER)
    }
  }, {
    tableName: 'yss_top',
    timestamps: false
  })
}
