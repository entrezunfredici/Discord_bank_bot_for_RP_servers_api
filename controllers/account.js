const jwt = require('jsonwebtoken');
const accountService = require('../services/account')
const moneyExchangesService = require('../services/moneyExchange')
const regularMoneyExchangesService = require('../services/regularMoneyExchanges')
const accessRightsService = require('../services/accessRights')
const createError = require('http-errors');
const { ServerError } = require('../errors');

exports.accountMiddleware = async (req, res, next) => {
    if (req.headers && !req.headers.authorization) {
        res.status(401).json({success: false, message: 'You need to be authenticated'});
    } else {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decodedToken = await jwt.verify(token, process.env.SECRET);
            if (decodedToken) {
                // We can store in req.locals = {} some info about the user to propagate into next controller
                next();
            } else {
                next(createError(401, 'Authentication is no more valid'))
            }
        } catch(e) {
            next(e);
        }
    }
}

exports.getAccountBybeneficiaryName = async (req, res, next)  => {
    const account = await accountService.getAccountBybeneficiaryName(req.params.beneficiaryName)
    if(account!=0){
        res.json({success: true, data: account})
    }else{
        next(createError(404, "this beneficiary haven't bank account"))
    }
}

exports.getAccountById = async (req, res, next)  => {
    const account = await accountService.getAccountById(req.params.Id)
    if(account){
        res.json({success: true, data: account})
    }else{
        next(createError(404, "this bank account doesn't exist"))
    }
}

exports.getExpenses = async (req, res, next) => {
    const expences = await moneyExchangesService.getMoneyExchangeBySenderId(req.params.Id)
    if(expences){
        res.json({success: true, data: expences})
    }else{
        next(createError(404, "you didn't spend any money"))
    }
}

exports.getPaiments = async (req, res, next) => {
    const paiments = await moneyExchangesService.getMoneyExchangeByReceiverId(req.params.Id)
    if(paiments){
        res.json({success: true, data: paiments})
    }else{
        next(createError(404, "you haven't earned any money"))
    }
}

exports.addAccount = async (req, res, next) => {
    const {creatorName, beneficiaryName, password, balance} = req.body
    try {
        const account = await accountService.addAccount(creatorName, beneficiaryName, password, balance)
        if (!account) {
            throw new ServerError('cannot create this account')
        }
        accessRightsService.editRights(beneficiaryName, account.id, true, true, false, false)
        return res.status(201).json({success: true, account})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.accountLogin = async (req, res, next) => {
    const {userName, id, password} = req.body
    try{
        const token = await accountService.accountLogin(userName, id, password)
        const account = await accountService.getAccountBybeneficiaryName(userName)
        const paiments = await moneyExchangesService.getMoneyExchangeByReceiverId(id)
        const expences = await moneyExchangesService.getMoneyExchangeBySenderId(id)
        const subscriptions = await regularMoneyExchangesService.getRegularMoneyExchangesBySenderId(id)
        const income = await regularMoneyExchangesService.getRegularMoneyExchangesByReceiverId(id)
        if(token){
            return res.status(200).json({success: true, account, paiments, expences, subscriptions, income})
        }
        return res.status(400).json({success: false})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.accountBalance = async (req, res, next) => {
    const {id, userName, sum, type} = req.body
    try{
        const change = await accountService.changeBalance(id, userName, sum, type)
        if(change){
            return res.status(200).json({success: true, change})
        }
        return res.status(400).json({success: false})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.changePassword = async (req, res, next) => {
    const {id, userName, password, newPassword} = req.body
    try{
        const change = await accountService.changePassword(id, userName, password, newPassword)
        if(change){
            return res.status(200).json({success: true, change})
        }
        return res.status(400).json({success: false})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.quickTransaction = async(req, res, next) => {
    const {id, name, reason, receiverId, userName, sum} = req.body
    try{
        const exchange = await accountService.quickTransaction(id, name, reason, receiverId, userName, sum)
        if(exchange){
            return res.status(200).json({success: true, exchange})
        }
        return res.status(400).json({success: false})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.deleteAccountById = async (req, res, next) => {
    try {
        await accountService.deleteAccountById(req.params.Id,req.params.userName)
        res.status(200).send({success: true})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.deleteAccountsBybeneficiaryName = async (req, res, next) => {
    try {
        await accountService.deleteAccountsBybeneficiaryName(req.params.beneficiaryName)
        res.status(200).send({success: true})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}
