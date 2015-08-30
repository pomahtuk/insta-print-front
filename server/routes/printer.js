const router = require('koa-router')();
const models = require('../models');
const Event = models.Event;
const constants = require('../constants');
const printerFunction = require('../utils/pdfGenerator');

// mock data
var mockPrintData = require('../mocks/printRequest.js');

//main functuon
router.post('/printer', function* () {
  var printingData = this.request.body;
  var dbRecord = null;

  try {

    console.time('printing');

    var fileName = yield printerFunction(printingData);

    console.timeEnd('printing');

    dbRecord = yield Event.create({
      eventType: constants.EVENT_TYPES.PHOTO_PRINTED,
      data: JSON.stringify(printingData)
    });

    this.status = 200;
    this.type = 'application/pdf';
    this.body = {
      output: fileName
    };
  } catch (err) {

    dbRecord = yield Event.create({
      eventType: constants.EVENT_TYPES.PHOTO_FAIL,
      data: JSON.stringify(printingData)
    });

    this.throw(err);
  }
});

// testing function - still want to be able to test
router.get('/printer', function* () {
  try {
    var doc = yield printerFunction(mockPrintData);

    this.status = 200;
    this.type = 'application/pdf';
    this.body = doc;
  } catch (err) {
    this.throw(err);
  }
});

module.exports = router;
