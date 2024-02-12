const { account } = require('../models')
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
        throw new NotFound("identifier or password are invalid")
    }
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de lire R)
    rights="R"
    if(rights=="R"){
        if(account.password==password){
            return account
        }else{
            throw new NotFound("identifier or password are invalid")
        }
    }else{
        throw new NotFound("you haven't access rights")
    }
}

exports.changeBalance = async (id, userId, sum, type) => {
    const account= await this.getAccountById(id)
    if(!account){
        throw new NotFound("this account doesn't exist")
    }
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de lire et écrire RW)
    rights="RW"
    if(rights=="RW"){
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

exports.deleteAccountByID = (id, userid) => {
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de supression RWCD)
    rights="RWCD"
    if(rights=="RWCD"){
        return account.destroy({
            where: {
                id
            }
        })
    }else{
        throw new NotLogged("you haven't access rights")
    }
}