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
    contact: require('./contact')(instance)
}

//Pour plus tard, pour lier les modeles entre eux : instance.models.review.belongsTo(instance.models.contact)