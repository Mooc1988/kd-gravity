'use strict'

const _ = require('lodash')
module.exports = function (sequelize) {
  const {STRING, BOOLEAN, ARRAY, JSONB} = sequelize.Sequelize
  return sequelize.define('Ad', {
    // 名称
    name: {
      type: STRING(128),
      allowNull: false
    },
    // 位置编号
    position: {
      type: STRING(128),
      allowNull: false
    },

    // 展现方式
    showType: {
      type: ARRAY(STRING(128)),
      allowNull: false
    },
    // e否开启
    enable: {
      type: BOOLEAN,
      defaultValue: true
    },
    baidu: {
      type: JSONB,
      validate: {isValidBaidu}
    },
    google: {
      type: JSONB,
      validate: {isValidGoogle}
    },
    chartbox: {
      type: JSONB
    },
    vungle: {
      type: JSONB
    },
    jusha: {
      type: JSONB
    },
    gdt: {
      type: JSONB
    },
    custom: {
      type: JSONB
    },
    meta: {
      type: JSONB
    }
  }, {
    classMethods: {
      associate ({Ad, App, User}) {
        Ad.belongsTo(App)
        Ad.belongsTo(User)
      }
    },
    tableName: 'ad',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['position', 'AppId']
      }
    ]
  })
}

function isValidBaidu (value) {
  let {aid, pid} = value
  if (_.isEmpty(aid) || _.isEmpty(pid)) {
    throw new Error('百度必须包含aid和pid')
  }
}

function isValidGoogle (value) {
  let {pid} = value
  if (_.isEmpty(pid)) {
    throw new Error('谷歌必须包含pid')
  }
}
