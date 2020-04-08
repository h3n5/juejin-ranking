const express = require('express')
const cors = require('cors')
const crontab = require('node-schedule')
const router = express.Router()
const task = require('./GetData/index')
const { findTag, findArticle, refreshData } = require('./Control')

crontab.scheduleJob('0 0 * * 1', () => task())
router.use(cors())
router.get('/getTag', findTag)
router.post('/getArticle', findArticle)
router.post('/refreshData', refreshData)

module.exports = router
