const express = require('express')
const router = express.Router()
const pinController = require('../controllers/pinController')
const protect = require('../middlewares/protect.middleware')

router.get('/', pinController.pinsGet)

router.get('/:id', pinController.pinGet)

router.post('/', protect, pinController.pinPost)

router.put('/:id', protect, pinController.pinUpdate)

router.delete('/:id', protect, pinController.pinDelete)

router.post('/search', protect, pinController.search)

router.post('/save/:id', protect, pinController.pinSave)

module.exports = router
