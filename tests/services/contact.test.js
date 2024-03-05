const contactService = require('../../services/contact')
const db = require('../../models')
const bcrypt = require('bcrypt')
require('dotenv').config()

jest.mock('../../models')

const mockedContact = [{
    id: 1, username: 'test01', password: 'password01'
}]

describe('getContactByUsername', () => {
    it('Should find a contact and return it', async ()=> {
        db.contact.findOne.mockReturnValueOnce(mockedContact[0])

        const contact = await contactService.getContactByUsername('test01')

        expect(contact).not.toBeNull()
        expect(contact).toEqual(mockedContact[0])
    })

    it('Should not find contact and return undefined', async () => {
        const contact = await contactService.getContactByUsername('toto')

        expect(contact).toBeUndefined()
    })
})

describe('contactRegister', () => {
    it('Should returns error if user already registered', async () => {
        db.contact.findOne.mockReturnValueOnce(mockedContact[0])

        await expect(() => contactService.addContact('test', 'test')).rejects.toThrow()
    })

    it('Should returns contact if registration works', async () => {
        const username = 'test'
        const password = 'test'

        db.contact.create.mockReturnValueOnce({
            username,
            password: 'hashed'
        })

        const contactAdded = await contactService.addContact(username, password)

        expect(contactAdded).not.toBeNull()
        expect(contactAdded.username).toEqual(username)
        expect(contactAdded.password).not.toEqual(password)
    })
})

describe('contactLogin', () => {
    it('Should returns error if user not found', async () => {
        db.contact.findOne.mockReturnValueOnce(null)

        await expect(() => contactService.loginContact('test', 'test')).rejects.toThrow()
    })

    it('Should returns error if password is incorrect', async () => {
        const username = 'test'
        const password = 'test'

        db.contact.findOne.mockReturnValueOnce({
            username, 
            password: bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS))
        })

        const token = await contactService.loginContact(username, password)

        expect(token).not.toBeNull()
    })
})

// describe('deleteContactByUsername', () => {
    
// })