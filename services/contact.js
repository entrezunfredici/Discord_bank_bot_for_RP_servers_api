const { contact } = require('../models')
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
    if (existingContact) {
        throw new BadRequest('Contact already exists')
    }
    if(!((role="client")||(role="banquier")||(role="entreprise"))) {
        throw new BadRequest('Need to have a role that already exist')
    }
    // switch (role) {
    //     case "client" : 
    //     break
    //     case "banquier" :
    //     break 
    //     case "entreprise" :
    //     break
    //     default :
    //     throw new BadRequest('Need to have a role that already exist')
    // }
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

    exports.deleteContactById = (id) => {
        return contact.destroy({
            where: {
                id
            }
        })
    }

    //TODO: créer Update !
    //TODO: créer rajouter condition (dans le controller je pense ) pour empécher création d'un contact sans username, password, ou role
    //TODO: contact qui se créent en permanence en role "client" et non les autres ...
    //TODO: delete qui ne fonctionne pas voir erreur ...