'use strict'
// 专辑模型
module.exports = function (sequelize, DataTypes) {
  const {INTEGER} = DataTypes
  return sequelize.define('YssAlbumApp', {
    order: {
      type: INTEGER.UNSIGNED,
      defaultValue: 1
    }
  }, {
    tableName: 'yss_album_app',
    timestamps: false
  })
}
