'use strict'

const debug = require('debug')('iped-queue-events:event-source')

const EventEmitter = require('events')
const emitter = new EventEmitter()
emitter.on('message', (message) => {
  debug(message)
})
module.exports = emitter
