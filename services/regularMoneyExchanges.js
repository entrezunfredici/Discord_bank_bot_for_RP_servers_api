const { regularMoneyExchanges } = require('../models')
const accountService = require('./account')
const { NotFound, NotLogged, BadRequest, ServerError } = require('../errors')

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

exports.addRegularMoneyExchange = async (senderId, receiverId, userId, amount, startDate, timeRange) => {
    if ((!amount) || (!startDate) || (!timeRange)) {
        throw new BadRequest("amount, startDate and timeRanges are required")
    }
    accountService.quickTransaction(senderId, receiverId, userId, amount)
    return regularMoneyExchanges.create({ senderId, receiverId, amount, startDate, timeRange })
}

exports.deleteRegularMoneyExchangeById = async (id, userid) => {
    const regularMoneyExchange = await regularMoneyExchanges.findOne({
        where: {
            id
        }
    })
    if (!regularMoneyExchange) {
        throw new NotFound("regularMoneyExchange not found")
    }
    if (regularMoneyExchange.senderId !== userid) {
        throw new BadRequest("you are not the sender")
    }
    return regularMoneyExchange.destroy()
}
