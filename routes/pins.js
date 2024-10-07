const express = require('express')
const router = express.Router()
const pinController = require('../controllers/pinController')

router.get('/', pinController.pinsGet)

router.get('/:id', pinController.pinGet)

router.post('/', pinController.pinPost)

router.put('/:id', pinController.pinUpdate)

router.delete('/:id', pinController.pinDelete)

module.exports = router
