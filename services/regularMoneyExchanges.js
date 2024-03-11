const { regularMoneyExchanges } = require('../models')
const accountService = require('./account')
const accessRightsService = require('./accessRights')
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

exports.addRegularMoneyExchange = async (senderId, receiverId, userName, amount, startDate, timeRange, timeUnit) => {
    if ((!amount) || (!startDate) || (!timeRange)) {
        throw new BadRequest("amount, startDate and timeRanges are required")
    }
    if(!(await accountService.getAccountById(senderId)) || !(await accountService.getAccountById(receiverId))){
        throw new NotFound("this accounts doesn't exist")
    }
    const rights= await accessRightsService.getRights(userName,senderId)
    console.log(rights)
    if(!rights){
        throw new NotFound("this rights doesn't exist")
    }
    if(timeUnit=="minutes"){
        const scheduleVar='*/'+timeRange.toString()+' * * * *'
        cron.schedule(scheduleVar,()=>{
            accountService.quickTransaction(senderId, "unnamed", "no reason", receiverId, userName, amount)
        })
        return regularMoneyExchanges.create({ senderId, receiverId, amount, startDate, timeRange, timeUnit })
    }
    if(timeUnit=="hours"){
        const scheduleVar='1 */'+timeRange.toString()+' * * *'
        cron.schedule(scheduleVar,()=>{
            accountService.quickTransaction(senderId, "unnamed", "no reason", receiverId, userName, amount)
        })
        return regularMoneyExchanges.create({ senderId, receiverId, amount, startDate, timeRange, timeUnit })
    }
    if(timeUnit=="days"){
        const scheduleVar='1 1 */'+timeRange.toString()+' * *'
        cron.schedule(scheduleVar,()=>{
            accountService.quickTransaction(senderId, "unnamed", "no reason", receiverId, userName, amount)
        })
        return regularMoneyExchanges.create({ senderId, receiverId, amount, startDate, timeRange, timeUnit })
    }
    if(timeUnit=="mounth"){
        const scheduleVar='1 1 */'+timeRange.toString()+' * *'
        cron.schedule(scheduleVar,()=>{
            accountService.quickTransaction(senderId, "unnamed", "no reason", receiverId, userName, amount)
        })
        return regularMoneyExchanges.create({ senderId, receiverId, amount, startDate, timeRange, timeUnit })
    }
    if(timeUnit=="week"){
        const scheduleVar='* * * * 1'
        cron.schedule(scheduleVar,()=>{
            accountService.quickTransaction(senderId, "unnamed", "no reason", receiverId, userName, amount)
        })
        return regularMoneyExchanges.create({ senderId, receiverId, amount, startDate, timeRange, timeUnit })
    }
    throw new BadRequest("this time unit doesn't exist")
}

exports.deleteRegularMoneyExchangeById = async (id, userName) => {
    return regularMoneyExchanges.destroy({
        where: {
            id
        }
    })
}
