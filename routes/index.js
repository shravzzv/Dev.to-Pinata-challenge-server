const express = require('express')
const router = express.Router()
const indexController = require('../controllers/indexController')

router.get('/file', indexController.fileGet)
router.post('/file', indexController.filePost)

module.exports = router
