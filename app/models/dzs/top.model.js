/**
 * Created by frank on 2017/4/13.
 */
'use strict'

module.exports = function (sequelize) {
  const {STRING, INTEGER, ARRAY} = sequelize.Sequelize
  return sequelize.define('DzsTop', {
    name: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    image: {
      type: STRING
    },
    books: {
      type: ARRAY(INTEGER)
    }
  }, {
    tableName: 'dzs_top',
    timestamps: false
  })
}
