const router = require('express').Router(), 
accountController = require('../controllers/account')
//route pour obtennir un compte via l'id du bénéficiaire
router.get('/beneficiaryId=:beneficiaryId', accountController.getAccountByBeneficiaryId);
//route pour obtennir un compte via l'id du compte
router.get('/Id=:Id', accountController.getAccountById);
//route pour se connecter
router.post('/login', accountController.accountLogin);
//route pour ajouter un compte
router.post('/add', accountController.addAccount);
router.post('/transaction', accountController.accountBalance);

module.exports = router;