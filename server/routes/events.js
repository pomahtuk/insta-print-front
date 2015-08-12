const router = require('koa-router')();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');


function* retreiveDBRecords(context) {
  var dbRecords = [];
  try {
    dbRecords = yield Event.find().exec();
  } catch (err) {
    context.throw(err);
  }
  return dbRecords;
}

function* updateDBRecord(context) {
  const payload = context.request.body;
  var dbRecord = null;

  if (!payload) {
    context.throw('The body is empty', 400);
  }

  if (!payload.eventType) {
    context.throw('Missing eventType', 400);
  }

  if (!payload.data) {
    context.throw('Missing event data', 400);
  }

  var eventType = payload.eventType,
    data = payload.data;

  try {
    dbRecord = new Event({
      eventType: eventType,
      data: data
    });

    yield dbRecord.save();
  } catch (err) {
    context.throw(err);
  }

  return dbRecord;
}

router.post('/events', function* () {
  var record = yield updateDBRecord(this);
  this.status = 200;
  this.body = record;
});


router.get('/events', function* () {
  var records = yield retreiveDBRecords(this);
  this.status = 200;
  this.body = records;
});


module.exports = router;
