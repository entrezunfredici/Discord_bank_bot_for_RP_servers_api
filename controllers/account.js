const accountService = require('../services/account')
const createError = require('http-errors');
const { ServerError } = require('../errors');


exports.getAccountByBeneficiaryId = async (req, res, next)  => {
    const account = await accountService.getAccountByBeneficiaryId(req.params.beneficiaryId)
    if(account!=0){
        res.json({success: true, data: account})
    }else{
        res.status(404).json("this beneficiary haven't bank account")
    }
}

exports.getAccountById = async (req, res, next)  => {
    const account = await accountService.getAccountById(req.params.Id)
    if(account){
        res.json({success: true, data: account})
    }else{
        res.status(404).json("this bank account doesn't exist")
    }
}

exports.addAccount = async (req, res, next) => {
    const {beneficiaryId, password, balance} = req.body
    try {
        const account = await accountService.addAccount(beneficiaryId, password, balance)
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