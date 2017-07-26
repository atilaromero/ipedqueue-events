'use strict'

require('../../models')
const mongoose = require('mongoose')
const Event = mongoose.model('Event')
const eventSource = require('../../lib/event-source')

module.exports.get = function get (req, res) {
  try {
    const id = req.swagger.params.id && req.swagger.params.id.value
    let filter = {}
    if (id) {
      filter = {evidence: id}
    }
    Event.find(filter, null, {sort: {date: 1}}, (err, docs) => {
      if (err) {
        console.log(err)
        return res.status(500).json({error: err.stack})
      }
      return res.json(docs)
    })
  } catch (err) {
    return res.status(500).json({error: err.stack})
  }
}

module.exports.post = function post (req, res) {
  try {
    const id = req.swagger.params.id.value
    const body = req.swagger.params.body.value
    const event = body.event
    const details = body.details
    let ev = new Event({
      evidence: id,
      event: event,
      details: details,
      date: Date.now()
    })
    ev.save((err) => {
      if (err) {
        console.log(err)
        return res.status(500).json({error: err.stack})
      }
      eventSource.emit('message', ev)
      return res.status(204).end()
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({error: err.stack})
  }
}
