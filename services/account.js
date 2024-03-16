const { account } = require('../models')
const moneyExchangesService = require('./moneyExchange')
const accessRightsService = require('./accessRights')
const bcrypt = require('bcrypt')
const passwords = require('./passwords')
const jwt = require('jsonwebtoken')
const { NotFound, NotLogged, BadRequest, ServerError } = require('../errors')

exports.getAccountBybeneficiaryName = async (beneficiaryName) => {
    return account.findAll({
        where:{
            beneficiaryName
        },
        attributes: { exclude: ['password'] }
    })
}

exports.getAccountById = async (id) => {
    return account.findOne({
        where:{
            id
        },
        attributes: { exclude: ['password'] }
    })
}

exports.getAccountByIdWithPassword = async (id) => {
    return account.findOne({
        where:{
            id
        }
    })
}

exports.addAccount = async (creatorName, beneficiaryName, password, balance) => {
    const rights= await accessRightsService.getRights(creatorName,-1)
    if(!rights){
        throw new NotFound("this rights doesn't exist")
    }
    if(rights.createRight){
        if(!balance){
            balance=0
        }
        if(await passwords.notePassword(password) < 5){
            throw new BadRequest("password must be at least 10 characters long, one Maj, one min, one number and one special character")
        }
        return bcrypt.hash(password, 10).then((hash) => {
            return account.create({beneficiaryName, password: hash, balance})
        }).catch((e) => {
            throw new ServerError(e.message)
        })
    }else{
        throw new NotLogged("you haven't access rights")
    }
}

exports.accountLogin = async (userName, id, password) => {
    const account = await this.getAccountByIdWithPassword(id)
    const accountReturned = await this.getAccountById(id)
    const rights= await accessRightsService.getRights(userName,id)
    if(!account){
        throw new NotFound("identifier or password are invalid")
    }
    if(!rights){
        throw new NotFound("this rights doesn't exist")
    }
    if(rights.readRight){
        const verifiedConnection = await bcrypt.compare(password, account.password)
        if (!verifiedConnection) {
            throw new NotLogged('password incorrect for username')
        }
        return accountReturned
    }else{
        throw new NotFound("you haven't access rights")
    }
}

exports.changeBalance = async (id, userName, amount, type) => {
    const account = await this.getAccountByIdWithPassword(id)
    const rights= await accessRightsService.getRights(userName,-1)
    if(!account){
        throw new NotFound("this account doesn't exist")
    }
    if(!rights){
        throw new NotFound("this rights doesn't exist")
    }
    if(rights.writeRight){
        switch(type){
            case "withdrawal":
                if(amount>account.balance){
                    throw new BadRequest("you don't have enough money")
                }
                amount = account.balance-amount 
                account.update({
                    balance: amount
                })
                break
            case "payment":
                amount += account.balance
                account.update({
                    balance: amount
                })
                break
            default:
                throw new BadRequest("this transaction doesn't exist")
        }
    }else{
        throw new NotLogged("you haven't access rights")
    }
    const accountReturned = await this.getAccountById(id)
    return accountReturned
}

exports.changePassword = async (id, userName, password, newPassword) => {
    const account = await this.getAccountById(id)
    const rights = await accessRightsService.getRights(userName,id)
    if(!account){
        throw new NotFound("this account doesn't exist")
    }
    if(!rights){
        throw new NotFound("this rights doesn't exist")
    }
    if(rights.writeRight && bcrypt.compare(password, account.password)){
        console.log(newPassword)
        if(await passwords.notePassword(newPassword) < 5){
            throw new BadRequest("password must be at least 10 characters long, one Maj, one min, one number and one special character")
        }
        balance = account.balance
        return bcrypt.hash(password, 10).then((hash) => {
            return account.update({beneficiaryName: userName, password: hash, balance})
        }).catch((e) => {
            throw new ServerError(e.message)
        })
    }else{
        throw new NotLogged("you haven't access rights")
    }
}

exports.quickTransaction = async (id, name, reason, receiverId, userName, amount) => {
    const account = await this.getAccountByIdWithPassword(id)
    const receiverAccount= await this.getAccountById(receiverId)
    const rights= await accessRightsService.getRights(userName,id)
    if(!account || !receiverAccount){
        throw new NotFound("this account doesn't exist")
    }
    if(!rights){
        throw new NotFound("this rights doesn't exist")
    }
    if(rights.readRight && rights.writeRight){
        if(amount>account.balance){
            throw new BadRequest("you don't have enough money")
        }
        if(!name){
            name="payment to "+receiverAccount.beneficiaryName
        }
        if(!reason){
            reason=""
        }
        moneyExchangesService.addMoneyExchange(name, reason, Date(), amount, id, receiverId)
        receiverAmount = receiverAccount.balance+amount
        receiverAccount.update({
            balance: receiverAmount
        })
        amount = account.balance-amount
        account.update({
            balance: amount
        })
    }else{
        throw new NotLogged("you haven't access rights")
    }
    const accountReturned = await this.getAccountById(id)
    return accountReturned
}

exports.deleteAccountById= async (id, userName) => {
    const verifAccount = await this.getAccountById(id)
    const rights= await accessRightsService.getRights(userName,-1)
    if(!rights){
        throw new NotFound("this rights doesn't exist")
    }
    if(rights.deleteRight){
        if(verifAccount){
            return account.destroy({
                where: {
                    id
                }
            })
        }else{
            throw new NotFound("this account doesn't exist")
        }
    }else{
        throw new NotLogged("you haven't access rights")
    }
}

exports.deleteAccountsBybeneficiaryName = async (beneficiaryName) => {
    return account.destroy({
        where: {
            beneficiaryName
        }
    })
}
