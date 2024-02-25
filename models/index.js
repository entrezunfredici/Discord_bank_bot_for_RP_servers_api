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
    contact: require('./contact')(instance),
    moneyExchange: require('./moneyExchange')(instance),
    regularMoneyExchanges: require('./regularMoneyExchanges')(instance)
}
//instance.models.account.belongsTo(instance.models.contact)
