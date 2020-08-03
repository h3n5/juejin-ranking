const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'
const bodyParser = require('body-parser')
async function start() {
  // Init Nuxt.js
  try {
    const nuxt = new Nuxt(config)

    const { host, port } = nuxt.options.server

    await nuxt.ready()
    // Build only in dev mode
    if (config.dev) {
      const builder = new Builder(nuxt)
      await builder.build()
    }
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    // if (!config.dev) {
    app.use('/api', require('../mongo'))
    // }
    // Give nuxt middleware to express
    app.use(nuxt.render)
    // Listen the server
    app.listen(port, host)
    consola.ready({
      message: `Server listening on http://localhost:${port}`,
      badge: true
    })
  } catch (error) {
    console.log('AutoConsole:', error)
  }
}
start()
