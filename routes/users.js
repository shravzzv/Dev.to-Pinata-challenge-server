const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const protect = require('../middlewares/protect.middleware')

router.post('/signup', userController.signUp)

router.post('/signin', userController.signIn)

router.get('/:id', userController.userGet)

router.put('/:id', protect, userController.userUpdate)

router.delete('/:id', protect, userController.userDelete)

module.exports = router
