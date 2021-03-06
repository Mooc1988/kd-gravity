'use strict'

module.exports = function (sequelize) {
  const {STRING, ARRAY} = sequelize.Sequelize
  return sequelize.define('WzryEquipment', {
    name: STRING,
    image: STRING,
    link: STRING,
    tags: ARRAY(STRING(128))
  }, {
    tableName: 'wzry_equipment',
    timestamps: false
  })
}
