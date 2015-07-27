const router = require('koa-router')();
const sendfile = require('koa-sendfile');
const path = require('path');
const mongoose = require("mongoose");
const InstagramKey = mongoose.model("InstagramKey");

const indexPath = path.normalize(__dirname + '/../../index.html');

function* updateDBRecord(key, context) {
  const payload = context.request.body;

  if (!payload) {
    context.throw("The body is empty", 400);
  }

  if (!payload.code) {
    context.throw("Missing code", 400);
  }

  try {
    var dbRecord = yield InstagramKey.findOne({'key': key}).exec();
    if (!dbRecord) {
      dbRecord = new InstagramKey({
        key: key
      });
    }
    dbRecord.value = payload.code;
    yield dbRecord.save();
  } catch (err) {
    context.throw(err);
  }

  return dbRecord;
}

function* retreiveDBRecord(key, context) {
  try {
    var dbRecord = yield InstagramKey.findOne({'key': key}).exec();
  } catch (err) {
    context.throw(err);
  }

  return dbRecord;
}

// Create a new route
router.post('/api-key', function* () {
  var record = yield updateDBRecord('api-key', this);
  this.status = 200;
  this.body = record;
});

router.get('/api-key', function* () {
  var record = yield retreiveDBRecord('api-key', this);
  this.status = 200;
  this.body = record;
});

router.post('/location-id', function* () {
  var record = yield updateDBRecord('location-id', this);
  this.status = 200;
  this.body = record;
});

router.get('/location-id', function* () {
  var record = yield retreiveDBRecord('location-id', this);
  this.status = 200;
  this.body = record;
});

router.get('/settings', function* () {
  var dbRecords = yield InstagramKey.find().exec();
  var result = {};
  dbRecords.map(function(record) {
    result[record.key] = record.value;
  });
  this.status = 200;
  this.body = result;
});

// pass everything to react
router.get('*', function* () {
  var stats = yield* sendfile.call(this, indexPath);
  if (!this.status) this.throw(404)
});


module.exports = router;
