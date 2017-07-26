'use strict'

const debug = require('debug')('iped-queue-events:event-source')

const EventEmitter = require('events')
const eventSource = new EventEmitter()
eventSource.on('message', (message) => {
  debug(message)
})
module.exports = eventSource
