const express = require('express')
const crontab = require('node-schedule')
const router = express.Router()
const task = require('./GetData/index')
const { findTag, findArticle, refreshData } = require('./Control')

crontab.scheduleJob('0 0 * * 1', task)

router.get('/getTag', findTag)
router.get('/getArticle', findArticle)
router.get('/refreshData', refreshData)

module.exports = router
