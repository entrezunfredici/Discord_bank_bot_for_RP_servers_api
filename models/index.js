const { Sequelize } = require('sequelize')
const dbConfig = require('../db.config')

const instance = new Sequelize({
    dialect: dbConfig.dialect,
    storage: dbConfig.storage
})

module.exports = {
    instance,
    /*to add an model type:
    model: require('./model')(instance)*/
    account: require('./account')(instance),
    regularMoneyExchanges: require('./regularMoneyExchanges')(instance)
}