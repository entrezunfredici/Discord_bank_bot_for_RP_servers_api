const { account } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { NotFound, NotLogged, BadRequest, ServerError } = require('../errors')

exports.getAccountByBeneficiaryId = async (beneficiaryId) => {
    return account.findAll({
        where:{
            beneficiaryId
        }
    })
}

exports.getAccountById = async (id) => {
    return account.findOne({
        where:{
            id
        }
    })
}

exports.addAccount = async (beneficiaryId, password, balance) => {
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de creer C)
    createRights=true
    if(createRights){
        if(!balance){
            balance=0
        }
        return bcrypt.hash(password, 10).then((hash) => {
            return account.create({beneficiaryId, password: hash, balance})
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
        // const token = jwt.sign({
        //     data: {id: user.id, username: user.username}
        // }, process.env.SECRET, {
        //     expiresIn: '300s'
        // })
        // return token
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

exports.quickTransaction = async (id, cibleId, userId, sum) => {
    const account= await this.getAccountById(id)
    const cibleAccount= await this.getAccountById(cibleId)
    if(!account){
        throw new NotFound("this account doesn't exist")
    }
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de lire et écrire W)
    writeRights=true
    if(writeRights){
        if(sum>account.balance){
            throw new BadRequest("you don't have enough money")
        }
        cibleSum = cibleAccount.balance+sum
        cibleAccount.update({
            balance: cibleSum
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

exports.deleteAccountByID = async (id, userid) => {
    const verifAccount = await this.getAccountById(id)
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de supression D)
    deleteRights=true
    if(deleteRights){
        // return account.destroy({
        //     where: {
        //         id
        //     }
        // })
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

exports.deleteAccountsByBeneficiaryID = async (beneficiaryID) => {
    return account.destroy({
        where: {
            beneficiaryID
        }
    })
    // verifBeneficiary= await this.getAccountByBeneficiaryId(beneficiaryID)
    // if(verifBeneficiary){
    //     return account.destroy({
    //         where: {
    //             beneficiaryID
    //         }
    //     })
    // }else{
    //     throw new NotFound("this account doesn't exist")
    // }
}
