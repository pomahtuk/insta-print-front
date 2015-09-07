const router = require('koa-router')();
const models = require('../models');
const Event = models.Event;
const constants = require('../constants');
const generatePdf = require('../utils/pdfGenerator');
const nodePrinter = require('printer');

// get list of system printers
router.get('/printer/list', function* () {
  var printerList = nodePrinter.getPrinters();
  this.status = 200;
  this.body = printerList;
});

//main functuon
router.post('/printer', function* () {
  var printingData = this.request.body;
  var fileName = '';

  try {
    console.time('printing');
    fileName = yield generatePdf(printingData);
    console.timeEnd('printing');

    yield Event.create({
      eventType: constants.EVENT_TYPES.PHOTO_PRINTED,
      data: JSON.stringify(printingData)
    });

    this.status = 200;
    this.body = {
      output: fileName
    };
  } catch (err) {
    yield Event.create({
      eventType: constants.EVENT_TYPES.PHOTO_FAIL,
      data: JSON.stringify(printingData)
    });
    this.throw(err);
  }
});

module.exports = router;
