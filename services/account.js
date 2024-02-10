const { account } = require('../models')

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
    if(balance){
        return account.create({
            beneficiaryId,
            password,
            balance
        })
    }else{
        balance=0
        return account.create({
            beneficiaryId,
            password,
            balance
        })
    }
}

//sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de lire R)
exports.accountLogin = async (userId, id, password) => {
    const account = await this.getAccountById(id)
    if(!account){
        throw new BadRequest("identifier or password are invalid")
    }
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de lire R)
    rights="R"
    if(rights=="R"){
        if(account.password==password){
            return account
        }else{
            throw new BadRequest("identifier or password are invalid")
        }
    }else{
        throw new BadRequest("you haven't access rights")
    }
}

//💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩
//💩   trasactions are not yet working      💩
//💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩
exports.changeBalance = async (id, userId, sum, type) => {
    account= await this.getAccountById(id)
    if(!account){
        throw new BadRequest("this account doesn't exist")
    }
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de lire et écrire RW)
    rights="RW"
    if(rights=="RW"){
        switch(type){
            case "withdrawal":
                account.balance-=sum
                break
            case "payment":
                account.balance+=sum
                break
            default:
                throw new BadRequest("this transaction doesn't exist")
        }
    }else{
        throw new BadRequest("you haven't access rights")
    }
    return account.balance
}