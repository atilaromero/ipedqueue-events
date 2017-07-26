'use strict'

const emitter = require('../../lib/emitter')

module.exports.get = function get (req, res) {
  try {
    res.status(200)
    res.set({
      'Content-type': 'text/event-stream charset=utf-8',
      'Transfer-Encoding': 'identity',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
    res.write('\n')
    emitter.on('message', (message) => {
      setImmediate(function onMessage () {
        res.write('data: ' + JSON.stringify(message) + '\n\n')
        res.flush()
      })
    })
  } catch (err) {
    return res.status(500).json({error: err.stack})
  }
}
