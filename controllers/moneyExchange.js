const moneyExchangesService = require('../services/moneyExchange')
const createError = require('http-errors');
const { ServerError } = require('../errors');

exports.getMoneyExchangeBySenderId = async (req, res, next)  => {
    const moneyExchange = await moneyExchangesService.getMoneyExchangeBySenderId(req.params.senderId)
    if(moneyExchange!=0){
        res.json({success: true, data: moneyExchange})
    }else{
        next(createError(404, "no exchanges sended"))
    }
}

exports.getMoneyExchangeByReceiverId = async (req, res, next)  => {
    const moneyExchange = await moneyExchangesService.getMoneyExchangeByReceiverId(req.params.receiverId)
    if(moneyExchange!=0){
        res.json({success: true, data: moneyExchange})
    }else{
        next(createError(404, "no exchanges received"))
    }
}

exports.getMoneyExchangeById = async (req, res, next)  => {
    const moneyExchange = await moneyExchangesService.getMoneyExchangeById(req.params.id)
    if(moneyExchange){
        res.json({success: true, data: moneyExchange})
    }else{
        next(createError(404, "this exchange doesn't exist"))
    }
}

exports.addMoneyExchange = async (req, res, next) => {
    const {name, reason, date, amount, senderId, receiverId} = req.body
    try {
        const moneyExchange = await moneyExchangesService.addMoneyExchange(name, reason, date, amount, senderId, receiverId)
        if (!moneyExchange) {
            throw new ServerError('cannot save this money exchange')
        }
        return res.status(201).json({success: true, moneyExchange})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.deleteMoneyExchangeById = async (req, res, next) => {
    try {
        await moneyExchangesService.deleteMoneyExchangeById(req.params.id)
        res.status(200).send({success: true})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}
