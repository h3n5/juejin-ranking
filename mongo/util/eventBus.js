const EventEmitter = require('eventemitter3')
let bus = new EventEmitter()
module.exports = bus
