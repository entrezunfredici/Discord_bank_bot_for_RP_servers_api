const { regularMoneyExchanges } = require('../models')
const accountService = require('./account')
const { NotFound, NotLogged, BadRequest, ServerError } = require('../errors')
const settedSenderId=0
const settedReceiverId=0
const settedUserId=0
const settedamount=0
const settedStartDate=0
const settedTimeRange=0

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
    // settedSenderId=senderId
    // settedReceiverId=receiverId
    // settedUserId=userId
    // settedamount=amount
    // settedStartDate=startDate
    // settedTimeRange=timeRange
    //test = await this.intervallUpdateAccountSystem(senderId, receiverId, amount, startDate, timeRange);
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

// exports.intervallUpdateAccountSystem = async (senderId, receiverId, amount, startDate, timeRange) => {
//     //for(k=0; k<1000000; k++)
//     accountService.quickTransaction(senderId, receiverId, userId, amount)
//     //for(k=0; k<10000000000; k++)
//     //accountService.quickTransaction(senderId, receiverId, userId, amount)
//     //var exchangeInterval = setInterval(accountService.quickTransaction(senderId, receiverId, userId, amount),(timeRange*1000));
//     return 1;
// }
// Définition de la fonction à exécuter à intervalle régulier
function intervallUpdateAccountSystem() {
    console.log("Ma fonction s'exécute");
    accountService.quickTransaction(settedSenderId, settedReceiverId, settedUserId, settedamount)
}

// Appel de la fonction à intervalle régulier (par exemple, toutes les 5 secondes)
if(settedTimeRange>0)setInterval(intervallUpdateAccountSystem, settedTimeRange*1000);