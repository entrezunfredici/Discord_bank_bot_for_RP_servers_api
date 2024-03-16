const { contact } = require('../models')
const accountService = require('./account')
const accessRightsService = require('./accessRights')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { NotFound, NotLogged, BadRequest, ServerError } = require('../errors')


exports.getContact = async () => {
    return await contact.findAll({ attributes: {exclude: ['password']} })
}

exports.getContactByUsername = async (username) => {
    return await contact.findOne({
        where: {
            username
        },
        attributes: {exclude: ['password']}
    })
}

exports.getContactForLogIn = async (username) => {
    return await contact.findOne({
        where: {
            username
        }
    })
}

exports.addContact = async (username, password, role) => {
    const existingContact = await this.getContactByUsername(username)
    constructorName="!_!/C/C/P/F/C/R/0/A/C/!_!ContactConstrctrutorParametreForCreateRights0fAccountConstrutor!_!"
    if(username.length <= 2){
        throw new BadRequest("Username must be at least 2 characters long")
    }
    if (existingContact || (username==constructorName)) {
        throw new BadRequest('Contact already exists')
    }
    if(!((role=="client")||(role=="banquier")||(role=="entreprise")||(role=="admin"))) {
        throw new BadRequest('Need an existing role')
    }
    if(password.length <= 10){
        throw new BadRequest("Password must be at least 10 characters long")
    }
    await accessRightsService.editRights(constructorName,-1,true,true,true,true)
    account = await accountService.addAccount(constructorName, username, password, 10)
    if(role=="banquier"){
        accessRightsService.editRights(username, -1, true, true, true, true)
    }
    await accessRightsService.editRights(username, account.id, true, true, false, false)
    await accessRightsService.deleteRights(constructorName,-1)
    return bcrypt.hash(password, 10).then((hash) => {
        return contact.create({username, password: hash, role})
    }).catch((e) => {
        throw new ServerError('Error when performing bcrypt: ', e.message)
    })
}

exports.loginContact = async (username, password) => {
    console.log(username)
    console.log(password)
    const contact = await this.getContactForLogIn(username)
    if (!contact) {
        throw new NotFound('No user found for username:' + username)
    }
    console.log(contact.id)
    const verifiedContact = await bcrypt.compare(password, contact.password)
    if (!verifiedContact) {
        throw new NotLogged('Password incorrect for username')
    }

    const token = jwt.sign({
        data: {id: contact.id, username: username}
    }, process.env.SECRET, {
        expiresIn: '30m'
    });
    if(!token){
        throw new ServerError('failed to create token')
    }
    return token
}

exports.updateContact = async (adminName, username, password, role) => {
    const contact = await this.getContactByUsername(username)
    const admin = await this.getContactByUsername(adminName)
    if(admin.role!="admin"){
        throw new BadRequest('you havent this rights')
    }
    if (!contact) {
        throw new NotFound('No user found for username:' + username)
    }
    return bcrypt.hash(password, 10).then((hash) => {
        return contact.update({username, password: hash, role})
    }).catch((e) => {
        throw new ServerError('Error when performing bcrypt: ', e.message)
    })
}

exports.deleteContactByUsername = async (username) => {
    const verifContact = await this.getContactByUsername(username)
    if (verifContact) {
        return contact.destroy({
            where: {
                username
            }
        })
    }else{
        throw new NotFound("This account doesn't exist")
    }
}
