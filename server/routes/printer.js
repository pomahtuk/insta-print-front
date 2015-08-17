const router = require('koa-router')();
const PDFDocument = require('pdfkit');
const request = require('koa-request').defaults({ encoding: null });
const fs = require('fs');
const path = require('path');
const os = require('os');
const mime = require('mime');

// pass everything to react
router.get('/printer', function* () {
  var doc = new PDFDocument({
    size: 'LEGAL',
    layout: 'landscape'
    // // thouse in  millimeters
    // page_width: '1682',
    // page_height: '2378'
  });

  var url = 'https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-15/11881798_104299353258093_2104323877_n.jpg';
  var img = yield request(url);

  doc.image(img.body, 320, 145, {width: 200, height: 100});

  doc.end();

  try {
    this.status = 200;
    this.type = 'application/pdf';
    this.body = doc;
  } catch (err) {
    this.throw(err);
  }
});

module.exports = router;
