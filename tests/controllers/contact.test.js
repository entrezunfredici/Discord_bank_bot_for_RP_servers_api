const request = require('supertest')
const app = require('../../app')
const contactService = require('../../services/contact')

const contact = [{
    id: 1,
    username: 'test01',
    password: 'password01',
    role: 'admin'
}, {
    id: 2,
    username: 'test02',
    password: 'password02',
    role: 'client'
}]

jest.mock('../../services/contact')

