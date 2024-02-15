const contactService = require('../services/contact')
const createError = require('http-errors')
const { ServerError } = require('../errors')

exports.getContact = async (req, res) => {
    const contact = await contactService.getContact()
    res.json({success: true, data: contact})
}

exports.getContactById = async (req, res, next) => {
    const contact = await contactService.getContactById(req.params.Id)
    if (contact) {
        res.json({success: true, data: contact})
    } else {
        res.status(404).json("This bank account doesn't exist")
    }
}

exports.addContact = async (req, res, next) => {
    const {username, password, role} = req.body
    try {
        const contact = await contactService.addContact(username, password, role)
        if (!contact) {
            throw new ServerError('Cannot create this contact')
        }
        return res.status(201).json({success: true, contact})
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}

exports.contactLogin = async (req, res, next) => {
    const {id, username, password} = req.body
    try {
        const token = await contactService.contactLogin(id, username, password)
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
        await contactService.deleteContactById(req.params.Id, req.params.userId)
        res.status(204).send()
    } catch(e) {
        return next(createError(e.statusCode, e.message))
    }
}