const { DataTypes } = require('sequelize')

module.exports = (instance) => {
    return instance.define('account', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        beneficiaryName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allownull: false
        },
        balance: {
            type: DataTypes.FLOAT,
            allownull: false
        },
    })
}