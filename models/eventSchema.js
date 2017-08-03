'use strict'

const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
  channel: String,
  type: String,
  evidence: String,
  date: Date
}, {strict: false})

module.exports.set('collection', 'event')
