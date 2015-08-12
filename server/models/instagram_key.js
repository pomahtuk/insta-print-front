'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema
 */
var InstagramKeySchema = new Schema({
  key: {type: String, default: ''},
  value: { type: String, default: '' }
});

mongoose.model('InstagramKey', InstagramKeySchema);
