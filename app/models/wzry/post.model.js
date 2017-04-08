'use strict'

module.exports = function (sequelize) {
  const {STRING} = sequelize.Sequelize
  return sequelize.define('WzryPost', {
    title: STRING,
    image: STRING,
    link: STRING,
    category: STRING,
    source: STRING
  }, {
    tableName: 'wzry_post',
    timestamps: false
  })
}
