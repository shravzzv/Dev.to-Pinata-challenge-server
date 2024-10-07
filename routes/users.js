const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/signup', userController.signUp)

router.post('/signin', userController.signIn)

router.get('/:id', userController.userGet)

router.put('/:id', userController.userUpdate)

router.delete('/:id', userController.userDelete)

module.exports = router
