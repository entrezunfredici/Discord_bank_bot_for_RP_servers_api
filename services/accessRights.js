const { accessRights } = require('../models')
const { NotFound, NotLogged, BadRequest, ServerError } = require('../errors')

exports.getRights = (userName, accountId) => {
    return accessRights.findAll({
        where:{
            userName, accountId
        }
    })
}

exports.editRights = async (userName, accountId, readRight, writeRight, createRight, deleteRight) => {
    if(!userName || !accountId){
        return new BadRequest("error")
    }else{
        const rights = await this.getRights(userName, accountId)
        if(rights!=0){
            rights.update({
                readRight: readRight,
                writeRight: writeRight,
                createRight: createRight,
                deleteRight: deleteRight,
            })
            return rights
        }else{
            return accessRights.create({userName, accountId, readRight, writeRight, createRight, deleteRight})
        }
    }
}

exports.deleteRights = async (userName, accountId) => {
    const verifRights = await this.getRights(userName, accountId)
    if(verifRights){
        return accessRights.destroy({
            where:{
                userName, accountId
            }
        })
    }else{
        throw new NotFound("this rights doesn't exist")
    }
}
