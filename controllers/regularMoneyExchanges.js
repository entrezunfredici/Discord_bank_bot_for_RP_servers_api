const regularMoneyExchangeService = require('../services/regularMoneyExchanges');
const createError = require('http-errors');
const { ServerError } = require('../errors');

exports.getRegularMoneyExchangesById = async (req, res, next) => {
    const regularMoneyExchange = await regularMoneyExchangeService.getRegularMoneyExchangesById(req.params.id)
    if(regularMoneyExchange!=0){
        res.json({success: true, data: regularMoneyExchangeService})
    }else{
        next(createError(404, "no regular money exchanges found for this id"))
    }
}

exports.getRegularMoneyExchangesBySenderId = async (req, res, next) => {
    const regularMoneyExchange = await regularMoneyExchangeService.getRegularMoneyExchangesBySenderId(req.params.senderId)
    if(regularMoneyExchange.length>0){
        res.json({success: true, data: regularMoneyExchange})
    }else{
        next(createError(404, "there are no withdrawals"))
    }
}

exports.getRegularMoneyExchangesByReceiverId = async (req, res, next) => {
    const regularMoneyExchange = await regularMoneyExchangeService.getRegularMoneyExchangesByReceiverId(req.params.receiverId)
    if(regularMoneyExchange.length>0){
        res.json({success: true, data: regularMoneyExchange})
    }else{
        next(createError(404, "there are no payments"))
    }
}

//the start date feature could not be implemented in time
exports.addRegularMoneyExchange = async (req,res,next) => {
    const {senderId, receiverId, userName, amount, timeRange, timeUnit} = req.body
    try {
        const regularMoneyExchange = await regularMoneyExchangeService.addRegularMoneyExchange(senderId, receiverId, userName, amount, timeRange, timeUnit)
        if(!regularMoneyExchange){
            throw new ServerError('cannot create this regular money exchange')
        }
        
        return res.status(201).json({success: true, data: regularMoneyExchange})
    }catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.deleteRegularMoneyExchangeById = async (req,res,next) => {
    try {
        await regularMoneyExchangeService.deleteRegularMoneyExchangeById(req.params.id,req.params.userName)
        res.status(200).send({success: true})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}
