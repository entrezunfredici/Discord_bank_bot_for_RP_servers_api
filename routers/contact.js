const router = require('express').Router(),
    contactController = require('../controllers/contact')

router.get('/', contactController.getContact)
router.get('/:id', contactController.getContactByUsername)
router.post('/login', contactController.login)
router.post('/register', contactController.register)
router.delete('/:id', contactController.deleteContactById)

module.exports = router
