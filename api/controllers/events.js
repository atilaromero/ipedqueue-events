'use strict'

require('../../models')
const mongoose = require('mongoose')
const Event = mongoose.model('Event')
const EventEmitter = require('events')
const emitter = new EventEmitter()

function sendStreamHeader (res) {
  res.status(200)
  res.set({
    'Content-type': 'text/event-stream charset=utf-8',
    'Transfer-Encoding': 'identity',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no',
    'Connection': 'keep-alive'
  })
  res.write('\n')
  res.flush()
}

function sendstream (res, channel, evidence) {
  sendStreamHeader(res)
  function chunk (message) {
    if ((!evidence) || (evidence === message.evidence)) {
      setImmediate(function onMessage () {
        res.write('event: ' + message.channel + '\n')
        res.write('data: ' + JSON.stringify(message) + '\n\n')
      })
    }
  }
  emitter.on(channel, chunk)
}

module.exports.get = function get (req, res) {
  try {
    const channel = req.swagger.params.channel && req.swagger.params.channel.value
    const evidence = req.swagger.params.evidence && req.swagger.params.evidence.value
    const since = req.swagger.params.since && req.swagger.params.since.value
    const stream = req.swagger.params.stream && req.swagger.params.stream.value

    if (since && stream) {
      console.error({error: "can't mix since and stream"})
      return res.status(400).json({error: "can't mix since and stream"})
    }

    if (stream) {
      return sendstream(res, channel, evidence)
    }

    let filter = {}
    if (channel) { Object.assign(filter, {channel}) }
    if (evidence) { Object.assign(filter, {evidence}) }
    if (since) { Object.assign(filter, {date: {$gte: new Date(since)}}) }

    Event.find(filter, null, {sort: {date: 1}}, (err, docs) => {
      if (err) {
        console.error(err.message)
        return res.status(500).json({error: err.stack})
      }
      return res.json(docs)
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: err.stack})
  }
}

module.exports.post = function post (req, res) {
  try {
    const body = req.swagger.params.body.value

    const obj = Object.assign({}, body)
    obj.date = Date.now()

    let ev = new Event(obj)
    ev.save((err) => {
      if (err) {
        console.error(err)
        return res.status(500).json({error: err.stack})
      }
      emitter.emit(body.channel, ev)
      emitter.emit(undefined, ev) // all channels
      return res.status(204).end()
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: err.stack})
  }
}
