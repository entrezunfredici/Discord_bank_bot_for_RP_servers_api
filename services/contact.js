const { contact } = require('../models')
const accountService = require('./account')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { NotFound, NotLogged, BadRequest, ServerError } = require('../errors')


exports.getContact = async () => {
    return await contact.findAll({attribute: {exclude: ['password']}})
}

exports.getContactByUsername = async (username) => {
    return await contact.findOne({
        where: {
            username
        }
    })
}

exports.addContact = async (username, password, role) => {
    const existingContact = await this.getContactByUsername(username)
    if(username.length <= 2){
        throw new BadRequest("Username must be at least 3 characters long")
    }
    if (existingContact) {
        throw new BadRequest('Contact already exists')
    }
    if(!((role=="client")||(role=="banquier")||(role=="entreprise")||(role=="admin"))) {
        throw new BadRequest('Need an existing role')
    }
    if(password.length <= 10){
        throw new BadRequest("Password must be at least 10 characters long")
    }
    accountService.addAccount(username, password, 10) 
    return bcrypt.hash(password, 10).then((hash) => {
        return contact.create({username, password: hash, role})
    }).catch((e) => {
        throw new ServerError('Error when performing bcrypt: ', e.message)
    })
}

exports.loginContact = async (username, password) => {
    const contact = await this.getContactByUsername(username)
    if (!contact) {
        throw new NotFound('No user found for username:' + username)
    }

    const verifiedContact = await bcrypt.compare(password, contact.password)
    if (!verifiedContact) {
        throw new NotLogged('Password incorrect for username')
    }

    const token = jwt.sign({
        data: {id: contact.id, username: contact.username}
    }, process.env.SECRET, {
            expiresIn: '30s'
        })
    return token
}

// exports.updateContact = async (username, password, role) => {
//     const contact = await this.getContactByUsername(username)
//     if 
// }

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



    //TODO: créer Update plus tard !
    //TODO: Rigths