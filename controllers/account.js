const jwt = require('jsonwebtoken');
const accountService = require('../services/account')
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

exports.addAccount = async (req, res, next) => {
    const {beneficiaryName, password, balance} = req.body
    try {
        const account = await accountService.addAccount(beneficiaryName, password, balance)
        if (!account) {
            throw new ServerError('cannot create this account')
        }
        return res.status(201).json({success: true, account})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.accountLogin = async (req, res, next) => {
    const {userId, id, password} = req.body

    try{
        const token = await accountService.accountLogin(userId, id, password)
        if(token){
            return res.status(200).json({success: true, token})
        }
        return res.status(400).json({success: false})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.accountBalance = async (req, res, next) => {
    const {id, userId, sum, type} = req.body
    try{
        const change = await accountService.changeBalance(id, userId, sum, type)
        if(change){
            return res.status(200).json({success: true, change})
        }
        return res.status(400).json({success: false})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.quickTransaction = async(req, res, next) => {
    const {id, cibleId, userId, sum} = req.body
    try{
        const exchange = await accountService.quickTransaction(id, cibleId, userId, sum)
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
        await accountService.deleteAccountByID(req.params.Id,req.params.userId)
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
