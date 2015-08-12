'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema
 */
var EventSchema = new Schema({
  eventType: {
    type: String,
    default: 'generic'
  },
  timeStamp: {
    type: Date,
    default: new Date()
  },
  data: {}
});

// Event.markModified('data');

mongoose.model('Event', EventSchema);
