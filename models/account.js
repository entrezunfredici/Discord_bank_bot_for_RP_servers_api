const { DataTypes } = require('sequelize')

module.exports = (instance) => {
    return instance.define('account', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        beneficiaryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allownull: false
        },
        balance: {
            type: DataTypes.INTEGER,
            allownull: false
        },
    })
}