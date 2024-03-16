const router = require('express').Router(), 
regularMoneyExchangesController = require('../controllers/regularMoneyExchanges')
//route pour obtennir l'ensemble des échanges réguliers créés par un utilisateur
router.get('/Id=:Id', regularMoneyExchangesController.getRegularMoneyExchangesById)
//route pour obtennir l'ensemble des échanges réguliers créés par un utilisateur
router.get('/senderId=:senderId', regularMoneyExchangesController.getRegularMoneyExchangesBySenderId)
//route pour obtennir l'ensemble des échanges réguliers reçues par un utilisateur
router.get('/receiverId=:receiverId', regularMoneyExchangesController.getRegularMoneyExchangesByReceiverId)
//route pour creer un echange régulier
router.post('/add', regularMoneyExchangesController.addRegularMoneyExchange)
//route pour supprimer un echange régulier
router.delete('/id=:id&userName=:userName', regularMoneyExchangesController.deleteRegularMoneyExchangeById)

module.exports = router;
