const express = require('express')
const router = express.Router()
const { findTag, findArticle } = require('./Control')

router.get('/getTag', findTag)
router.get('/getArticle', findArticle)
module.exports = router
