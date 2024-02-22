const accountService = require('../../services/account')
const db = require('../../models')
const bcrypt = require('bcrypt')
require('dotenv').config()

jest.mock('../../models')   // Mocking the models

const mockedAccount = [{
    id: 1,
    beneficiaryName: 1,
    password: 'password',
    balance: 0
}]

describe('getAccountBybeneficiaryName', () => {
    it('should return an account', async () => {
        //Mock 
        db.account.findAll.mockResolvedValue(mockedAccount)
        //when 
        const account = await accountService.getAccountBybeneficiaryName(1)
        //Then
        expect(account).not.toBeNull()
        expect(account).toEqual(mockedAccount[0])
    })
    it('should not find account and return undefined', async () => {
        // When
        const account = await accountService.getAccountBybeneficiaryName(1)
        // Then
        expect(account).toBeUndefined()
    })
})

describe('getAccountById', () => {
    it('should find account and return it', async () => {
        //mock
        db.account.findOne.mockReturnValueOnce(mockedUsers[0])
        //then
        expect(account).not.toBeNull()
        expect(account).toEqual(mockedAccount[0])
    })
    it('should not find account and return undefined', async () => {
        // When
        const account = await accountService.getAccountById(1)
        // Then
        expect(account).toBeUndefined()
    })
})

describe('addAccount', () => {
    it('should returns error if account already registered', async () => {
        // Mock
        db.account.findOne.mockReturnValueOnce(mockedAccount[0])
        // When/Then
        await expect(() => accountService.addAccount(1, "azertyuiop", 0)).rejects.toThrow()
    })
    it('should returns account if registration works', async () => {
        // Given
        const beneficiaryName= 1
        const password= "azertyuiop"
        const balance= 50
        // Mock
        db.account.create.mockReturnValueOnce({
            beneficiaryName,
            password: 'hashed',
            balance
        })
        // When
        const accountAdded = await usersService.addAccount(beneficiaryName, password, balance)
        // Then
        expect(accountAdded).not.toBeNull()
        expect(accountAdded.beneficiaryName).toEqual(beneficiaryName)
        expect(accountAdded.balance).toEqual(balance)
        // Assert password has been updated by service
        expect(accountAdded.password).not.toEqual(password)
    })
})

describe('accountLogin', () => {
    it('should returns error if account not found', async () => {
        // Mock
        db.account.findOne.mockReturnValueOnce(null)
        // When/Then
        await expect(() => accountService.accountLogin(1, 1, "azertyuiop")).rejects.toThrow()
    })
    it('should returns error if password is incorrect', async () => {
        // Given
        const userId = 1
        const id = 1
        const password = "azertyuiop"   // Password to check
        //mock
        db.account.findOne.mockReturnValueOnce({
            userId,
            id,
            password: bcrypt.hashSync('otherPassword', parseInt(process.env.SALT_ROUNDS))
        })
        // When/Then
        await expect(() => accountService.accountLogin(userId, id, password)).rejects.toThrow()
    })
    it('should returns account if login works', async () => {
        // Given
        const userId = 1
        const id = 1
        const password = "azertyuiop"   // Password to check

        // Mock
        db.account.findOne.mockReturnValueOnce({
            userId,
            id,
            password: bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS))
        })
        // When
        const account = await accountService.accountLogin(userId, id, password)
        // Then
        expect(account).not.toBeNull()
    })
})

describe('changeBalance', () => {
    it('should returns error if account not found', async () => {
        // Mock
        db.account.findOne.mockReturnValueOnce(null)
        // When/Then
        await expect(() => accountService.changeBalance(1, 1, 50, 'withdrawal')).rejects.toThrow()
    })
    it('should returns error if transaction doesnt exist', async () => {
        // Mock
        db.account.findOne.mockReturnValueOnce(null)
        // When/Then
        await expect(() => accountService.changeBalance(1, 1, 50, 'add')).rejects.toThrow()
    })
    it('should returns error if acclunt balance is insuffisant', async () => {
        // Mock
        db.account.findOne.mockReturnValueOnce(null)
        // When/Then
        await expect(() => accountService.changeBalance(1, 1, 2000, 'withdrawal')).rejects.toThrow()
    })
    it('should returns account if balance change works', async () => {
        // Given
        const id = 1
        const userId = 1
        const sum = 50
        const type = 'withdrawal'
        // Mock
        db.account.findOne.mockReturnValueOnce(mockedAccount[0])
        db.account.update.mockReturnValueOnce([1])
        // When
        const account = await accountService.changeBalance(id, userId, sum, type)
        // Then
        expect(account).not.toBeNull()
        expect(account.balance).toEqual(mockedAccount[0].balance + sum)
    })
})

describe('quickTransaction', () => {
    it('should returns error if account doesnt exist', async () => {
        // Mock
        db.account.findOne.mockReturnValueOnce(null)
        // When/Then
        await expect(() => accountService.quickTransaction(1, 1, 2, 50)).rejects.toThrow()
    })
    it('should returns account if quick transaction works', async () => {
        // Given
        const id = 1
        const cibleId = 2
        const userId = 1
        const sum = 50
        // Mock
        db.account.findOne.mockReturnValueOnce(mockedAccount[0])
        db.account.update.mockReturnValueOnce([1])
        // When
        const account = await accountService.quickTransaction(id, cibleId, userId, sum)
        // Then
        expect(account).not.toBeNull()
        expect(account.balance).toEqual(mockedAccount[0].balance - sum)
    })
})