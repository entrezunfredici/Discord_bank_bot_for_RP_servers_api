const router = require('express').Router(), 
moneyExchangeController = require('../controllers/moneyExchange')

//route pour obtennir une transaction via l'id de l'envoyeur
router.get('/senderId=:senderId', moneyExchangeController.getMoneyExchangeBySenderId)
//route pour obtennir une transaction via l'id du receveur
router.get('/receiverId=:receiverId', moneyExchangeController.getMoneyExchangeByReceiverId)
//route pour btennnir une transaction via son id
router.get('/id=:id', moneyExchangeController.getMoneyExchangeById)
//route pour sauvegarder une transaction
router.post('/add', moneyExchangeController.addMoneyExchange)
//route pour supprimer une transaction
router.delete('/id=:id', moneyExchangeController.deleteMoneyExchangeById)

module.exports = router;
