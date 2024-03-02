const accessRightsService = require('../services/accessRights')
const createError = require('http-errors');
const { ServerError } = require('../errors')

exports.getRights = async (req, res, next) => {
    const rights = await accessRightsService.getRights(req.params.userName, req.params.accountId)
    if(rights!=0){
        res.json({success: true, data: rights})
    }else{
        next(createError(404, "no rights"))
    }
}

exports.editRights = async  (req, res, next) => {
    const {userName, accountId, readRight, writeRight, createRight, deleteRight} = req.body
    try{
        const rights = await accessRightsService.editRights(userName, accountId, readRight, writeRight, createRight, deleteRight)
        if(!rights){
            throw new ServerError('cannot edit this rights')
        }
        return res.status(201).json({success: true, rights})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.deleteRights = async (req, res, next) => {
    try {
        await accessRightsService.deleteRights(req.params.userName,req.params.accountId)
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}
