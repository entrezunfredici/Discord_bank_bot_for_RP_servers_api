const { regularMoneyExchanges } = require('../models')
const accountService = require('./account')
const { NotFound, NotLogged, BadRequest, ServerError } = require('../errors')
const cron = require('node-cron')

exports.getRegularMoneyExchangesById = async (id) => {
    regularMoneyExchanges.findOne({
        where:{
            id
        }
    })
}

exports.getRegularMoneyExchangesBySenderId = async (senderId) => {
    return regularMoneyExchanges.findAll({
        where: {
            senderId
        }
    })
}

exports.getRegularMoneyExchangesByReceiverId = async (receiverId) => {
    return regularMoneyExchanges.findAll({
        where: {
            receiverId
        }
    })
}

exports.addRegularMoneyExchange = async (senderId, receiverId, userName, amount, startDate, timeRange) => {
    if ((!amount) || (!startDate) || (!timeRange)) {
        throw new BadRequest("amount, startDate and timeRanges are required")
    }
    if(!accountService.getAccountById(senderId) || !accountService.getAccountById(receiverId)){
        throw new BadRequest("acthisd accoutns doesn't exist")
    }
    console.log("start cron")
    cron.schedule('* * * * *',()=>{
        accountService.quickTransaction(senderId, "unnamed", "no reason", receiverId, userName, amount)
    })
    return regularMoneyExchanges.create({ senderId, receiverId, amount, startDate, timeRange })
}

exports.deleteRegularMoneyExchangeById = async (id, userName) => {
    return regularMoneyExchanges.destroy({
        where: {
            id
        }
    })
}
