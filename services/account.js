const { account } = require('../models')
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

exports.addAccount = async (beneficiaryName, password, balance) => {
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de creer C)
    createRights=true
    if(createRights){
        if(!balance){
            balance=0
        }
        if(passwords.notePassword(password) < 1){
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

//sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de lire R)
exports.accountLogin = async (userId, id, password) => {
    const account = await this.getAccountById(id)
    if(!account){
        throw new NotFound("identifier or password are invalid")
    }
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de lire R)
    readRights=true
    if(readRights){
        const verifiedConnection = await bcrypt.compare(password, account.password)
        if (!verifiedConnection) {
            throw new NotLogged('password incorrect for username')
        }
        return account
    }else{
        throw new NotFound("you haven't access rights")
    }
}

exports.changeBalance = async (id, userId, sum, type) => {
    const account= await this.getAccountById(id)
    if(!account){
        throw new NotFound("this account doesn't exist")
    }
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de lire et écrire W)
    writeRights=true
    if(writeRights){
        switch(type){
            case "withdrawal":
                if(sum>account.balance){
                    throw new BadRequest("you don't have enough money")
                }
                sum = account.balance-sum 
                account.update({
                    balance: sum
                })
                break
            case "payment":
                sum += account.balance
                account.update({
                    balance: sum
                })
                break
            default:
                throw new BadRequest("this transaction doesn't exist")
        }
    }else{
        throw new NotLogged("you haven't access rights")
    }
    return account
}

exports.changePassword = async (id, userId, password, newPassword) => {
    const account= await this.getAccountById(id)
    if(!account){
        throw new NotFound("this account doesn't exist")
    }
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de lire et écrire W)
    writeRights=true
    if(writeRights && bcrypt.compare(password, account.password)){
        console.log(newPassword)
        return account.update({newPassword})
        if(passwords.notePassword(newPassword) < 1){
            throw new BadRequest("password must be at least 10 characters long, one Maj, one min, one number and one special character")
        }
        return bcrypt.hash(newPassword, 10).then((hash) => {
            console.log(hash)
            return account.update({
                password: hash
            })
        }).catch((e) => {
            throw new ServerError(e.message)
        })
    }else{
        throw new NotLogged("you haven't access rights")
    }
}

exports.quickTransaction = async (id, receiverId, userId, sum) => {
    const account= await this.getAccountById(id)
    const receiverAccount= await this.getAccountById(receiverId)
    if(!account || !receiverAccount){
        throw new NotFound("this account doesn't exist")
    }
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de lire et écrire W)
    writeRights=true
    if(writeRights){
        if(sum>account.balance){
            throw new BadRequest("you don't have enough money")
        }
        receiversum = receiverAccount.balance+sum
        receiverAccount.update({
            balance: receiversum
        })
        sum = account.balance-sum
        account.update({
            balance: sum
        })
    }else{
        throw new NotLogged("you haven't access rights")
    }
    return account
}

exports.deleteAccountById= async (id, userid) => {
    const verifAccount = await this.getAccountById(id)
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de supression D)
    deleteRights=true
    if(deleteRights){
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
