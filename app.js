'use strict'

const config = require('config')
const mongoose = require('mongoose')
const SwaggerExpress = require('swagger-express-mw')
const app = require('express')()
module.exports = app // for testing

const url = `mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DB}`
mongoose.connect(url, {useMongoClient: true})

SwaggerExpress.create({appRoot: __dirname}, function (err, swaggerExpress) {
  if (err) { throw err }

  // enable SwaggerUI
  app.use(swaggerExpress.runner.swaggerTools.swaggerUi())

  // install middleware
  swaggerExpress.register(app)

  const port = config.PORT
  app.listen(port, () => {
    console.log('Listening on:', port)
  })
})
