const { DataTypes } = require('sequelize')

module.exports = (instance) => {
    return instance.define('accessRights', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        readRight: {
            type: DataTypes.BOOLEAN
        },
        writeRight: {
            type: DataTypes.BOOLEAN
        },
        createRight: {
            type: DataTypes.BOOLEAN
        },
        deleteRight: {
            type: DataTypes.BOOLEAN
        }
    })
}