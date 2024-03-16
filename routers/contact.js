const router = require('express').Router(),
contactController = require('../controllers/contact')

router.get('/', contactController.getContact)
router.get('/:username', contactController.getContactByUsername)
router.post('/login', contactController.loginContact)
router.post('/register', contactController.register)
router.post('/updateContact', contactController.updateContact)
router.delete('/delete/:username', contactController.deleteContactByUsername)

module.exports = router
