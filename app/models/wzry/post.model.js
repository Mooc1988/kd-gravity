'use strict'

module.exports = function (sequelize) {
  const {STRING, INTEGER, DATEONLY} = sequelize.Sequelize
  return sequelize.define('WzryPost', {
    title: STRING,
    image: STRING,
    link: STRING,
    category: INTEGER,
    source: STRING,
    createdAt: DATEONLY
  }, {
    tableName: 'wzry_post',
    timestamps: false
  })
}
