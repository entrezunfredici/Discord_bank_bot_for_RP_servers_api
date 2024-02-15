const { DataTypes } = require('sequelize')

module.exports = (instance) => {
    return instance.define('contact', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account: {
            type: DataTypes.INTEGER,
        },
        partner: {
            type: DataTypes.INTEGER,
        }
    })
}