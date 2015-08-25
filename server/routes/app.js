const router = require('koa-router')();
const path = require('path');
const models  = require('../models');
const keyValueStore = models.keyValueStore;

function* updateDBRecord(key, context) {
  const payload = context.request.body;

  if (!payload) {
    context.throw('The body is empty', 400);
  }

  if (!payload.code) {
    context.throw('Missing code', 400);
  }

  try {
    var dbRecord = yield keyValueStore.findOrCreate({
      where: {key: key}
    });
    if (dbRecord && dbRecord[0] ) {
      dbRecord = dbRecord[0];
    } else {
      throw new Error('returned not an drray at db update');
    }
    yield dbRecord.update({value: payload.code});
  } catch (err) {
    context.throw(err);
  }

  return dbRecord;
}

function* retreiveDBRecord(key, context) {
  try {
    var dbRecord = yield keyValueStore.findOne({where: {key: key}});
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
  var dbRecords = yield keyValueStore.findAll();
  var result = {};
  dbRecords.map(function(record) {
    result[record.key] = record.value;
  });
  this.status = 200;
  this.body = result;
});

// pass everything to react
router.get('*', function* () {
  var siteUrl = process.env.SITE_URL ? process.env.SITE_URL : 'localhost:3000';

  yield this.render('index', {
    title: 'Instagram vending machine',
    API_URL: 'http://' + siteUrl,
    SOCKET_URL: 'ws://' + siteUrl,
    CLIENT_ID: '0e746470835249b0a01487361b63d20d',
    REDIRECT_URI: 'http://' + siteUrl + '/tools',
    PROXY_API_URL: 'http://' + siteUrl + '/proxy'
  });
});


module.exports = router;
