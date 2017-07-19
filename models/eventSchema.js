'use strict'

const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
  evidence: String,
  event: String,
  details: Object,
  date: Date
})

module.exports.set('collection', 'event')
