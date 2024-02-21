const { DataTypes } = require('sequelize')

module.exports = (instance) => {
    return instance.define('regularMoneyExchanges', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        startDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timeRange: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    })
}