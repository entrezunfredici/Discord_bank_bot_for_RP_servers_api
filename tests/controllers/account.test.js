const request = require('supertest')
const app = require('../../app')
const accountService = require('../../services/account')

const app = [{
    id: 1,
    beneficiaryName: 1,
    password: 'password',
    balance: 0
},{
    id: 2,
    beneficiaryName: 2,
    password: 'poliakov',
    balance: 50
}]

jest.mock('../../services/account')

