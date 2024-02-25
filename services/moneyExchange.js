const { moneyExchange } = require('../models')
const { NotFound, NotLogged, BadRequest, ServerError } = require('../errors')

exports.getMoneyExchangeBySenderId = async (senderId) => {
    return moneyExchange.findAll({
        where:{
            senderId
        }
    })
}

exports.getMoneyExchangeByReceiverId = async (receiverId) => {
    return moneyExchange.findAll({
        where:{
            receiverId
        }
    })
}

exports.getMoneyExchangeById = async (id) => {
    return moneyExchange.findOne({
        where:{
            id
        }
    })
}

exports.addMoneyExchange = async (name, reason, date, amount, senderId, receiverId) => {
    if(!amount){
        return new BadRequest("error")
    }else{
        return moneyExchange.create({name, reason, date, amount, senderId, receiverId})
    }
}

exports.deleteMoneyExchangeById = async (id) => {
    const verifMoneyExchange = await this.getMoneyExchangeBySenderId(id)
    //sera à améliorer lorsque les droits d'accés seront créés (nécéssitant droit de supression D)
    if(verifMoneyExchange){
        return moneyExchange.destroy({
            where: {
                id
            }
        })
    }else{
        throw new NotLogged("you haven't access rights")
    }
}
