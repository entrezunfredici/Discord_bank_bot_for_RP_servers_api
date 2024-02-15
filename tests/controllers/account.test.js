const request = require('supertest')
const app = require('../../app')
const usersService = require('../../services/account')

const app = [{
    id: 1,
    beneficiaryId: 1,
    password: 'password',
    balance: 0
},{
    id: 2,
    beneficiaryId: 2,
    password: 'poliakov',
    balance: 50
}]

jest.mock('../../services/account')

