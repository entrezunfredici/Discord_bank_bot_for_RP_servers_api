const router = require('express').Router(), 
accessRightsController = require('../controllers/accessRights')

router.get('/userName=:userName&accountId=:accountId', accessRightsController.getRights);

router.post('/editRights', accessRightsController.editRights)

router.delete('/userName=:userName&accountId=:accountId', accessRightsController.deleteRights)

module.exports = router;
