const router = require('express').Router(), 
accountController = require('../controllers/account')

//route pour obtennir un compte via le nom du bénéficiaire
router.get('/beneficiaryName=:beneficiaryName', accountController.getAccountBybeneficiaryName);
//route pour obtennir un compte via l'id du compte
router.get('/Id=:Id', accountController.getAccountById);
//route pour obtennir un compte via l'id du compte
router.get('/expenses/Id=:Id', accountController.getExpenses);
//route pour obtennir un compte via l'id du compte
router.get('/paiments/Id=:Id', accountController.getPaiments);
//route pour se connecter
router.post('/login', accountController.accountLogin);
//route pour ajouter un compte
router.post('/add', accountController.addAccount);
//route pour faire une transaction
router.post('/transaction', accountController.accountBalance);
//route pour changer le mot de passe
router.post('/changePassword', accountController.changePassword);
//route pour faire une transaction directe
router.post("/quickTransaction", accountController.quickTransaction);
//route pour supprimer un compte
router.delete('/Id=:Id&userName=:userName', accountController.deleteAccountById);
//route pour supprimer un compte via l'id du bénéficiaire
router.delete('/beneficiaryName=:beneficiaryName', accountController.deleteAccountsBybeneficiaryName);

module.exports = router;
