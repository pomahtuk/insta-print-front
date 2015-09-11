const router = require('koa-router')();
const models = require('../models');
const Event = models.Event;
const constants = require('../constants');


function* retreiveDBRecords(context) {
  var dbRecords = [];
  try {
    dbRecords = yield Event.findAll();
  } catch (err) {
    context.throw(err);
  }

  dbRecords.forEach(function(record) {
    record.data = JSON.parse(record.data);
  });

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
    dbRecord = yield Event.create({
      eventType: eventType,
      data: JSON.stringify(data)
    });
  } catch (err) {
    context.throw(err);
  }

  return dbRecord;
}

function* calculateStatistics(context) {
  var statsObject = {};
  var eventTypes = constants.EVENT_TYPES;
  var eventKeys = Object.keys(eventTypes);

  try {
    for (var i = 0; i < eventKeys.length; i++) {
      var eventKey = eventKeys[i];
      var eventName = eventTypes[eventKey];

      statsObject[eventName] = yield Event.findAll({
        where: {
          eventType: eventName
        }
      });
    }
  } catch (err) {
    context.throw(err);
  }

  // clculate revenuex

  return statsObject;
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
