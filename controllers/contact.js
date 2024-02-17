const jwt = require('jsonwebtoken')
const contactService = require('../services/contact')
const createError = require('http-errors')
const { ServerError } = require('../errors')

exports.getContact = async (req, res) => {
    const contact = await contactService.getContact()
    res.json({success: true, data: contact})
}

exports.getContactByUsername = async (req, res, next) => {
    const contact = await contactService.getContactByUsername(req.params.Id)
    if (contact) {
        res.json({success: true, data: contact})
    } else {
        res.status(404).json("This contact doesn't exist")
    }
}

exports.contactMiddleware = async (req, res, next) => {
    if (req.headers && !req.headers.authorization) {
        res.status(401).json({success: false, message: 'You need to be authenticated'})
    } else {
        const token = req.headers.authorization.split('')[1]
        try {
            const decodedToken = await jwt.verify(token, process.env.SECRET)
            if (decodedToken) {
                next()
            } else {
                next(createError(401, 'Authentication is no more valid'))
            }
        } catch(e) {
            next(e)
        }
    }
}

exports.register = async (req, res, next) => {
    const {username, password, role} = req.body

    try {
        const contact = await contactService.addContact(username, password, role)
        if (!contact) {
            throw new ServerError('Cannot register contact')
        }
        return res.status(201).json({success: true, contact}).send()
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.loginContact = async (req, res, next) => {
    const {username, password} = req.body
    try {
        const token = await contactService.loginContact(username, password)
        if (token) {
            return res.status(200).json({success: true, token})
        }
        return res.status(400).json({success: false})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.deleteContactById = async (req, res, next) => {
    try {
        await contactService.deleteContactById(req.params.Id)
        res.status(204).send()
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}