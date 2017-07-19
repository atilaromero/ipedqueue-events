'use strict'

const mongoose = require('mongoose')
const eventSchema = require('./eventSchema')
mongoose.model('Event', eventSchema)
