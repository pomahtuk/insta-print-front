const router = require('koa-router')();
const PDFDocument = require('pdfkit');
const request = require('koa-request').defaults({ encoding: null });
const fs = require('fs');
const path = require('path');
const os = require('os');
const co = require('co');

// set conversion values
const mmToPixel = 3.779527559055;
const mmToInch = 0.0393700787;
// sizes setup
const imageSize = 66.2 * mmToPixel;
const textHeight = 20.4 * mmToPixel;
const margin = 5 * mmToPixel;
const pageHeight = 101.6 * mmToPixel;
const pageWidth = 152.4 * mmToPixel;

// mock data
var printData = require('../mocks/printRequest.js');

const fontRegularPath = path.normalize(path.join(__dirname, '/../../client/fonts/Roboto-Regular.ttf'));

// allow iterate over object making async calls
function *mapGen (arr, callback) {
  for (var i = 0; i < arr.length; i++) {
    yield callback(arr[i], i);
  }
}

// pass everything to react
router.get('/printer', function* () {
  var doc = new PDFDocument({
    layout: 'landscape',
    size: [pageHeight, pageWidth]
  });

  doc.registerFont('Roboto', fontRegularPath);

  var printDataSize = printData.length - 1;

  function recurseExtract(text, searchArr, i, container) {
    // no text left
    if (!text) return;

    var search = searchArr[i];
    var splittingArr = text.split(search);
    var index = text.indexOf(search);

    if (index === 0) {
      container.push({
        text: search,
        type: 'tag'
      });
      container.push({
        text: splittingArr[0],
        type: 'text'
      });
    }else if (index !== 0) {
      container.push({
        text: splittingArr[0],
        type: 'text'
      });
      container.push({
        text: search,
        type: 'tag'
      });
    }

    recurseExtract(splittingArr[1], searchArr, i += 1, container);

  }

  function extractHashTags(text) {
    // here we have a hashtags
    var hashTagsArray = text.match(/#\w+/g);
    var resultArray = [];

    recurseExtract(text, hashTagsArray, 0, resultArray);

    return resultArray;
  }

  function* drawImage (image, index) {
    image = image.data;

    var divisionLeftover = index % 2;
    var shouldCreateNewPage = printDataSize - index > 0 && divisionLeftover === 1;
    var leftOffset = margin + (2 * margin + imageSize) * divisionLeftover;

    var url = image.images.standard_resolution.url;
    var img = yield request(url);

    // may fall with image body - make a fallback
    // use some empty image?
    doc.image(img.body, leftOffset, margin, {width: imageSize});

    // get text and extract hastags
    var origText = image.caption ? image.caption.text : '';
    var textsArray = extractHashTags(origText);

    doc.font('Roboto');
    doc.fontSize(11);
    doc.moveTo(0, 0);

    var currentText = doc.text('', leftOffset, imageSize + (2 * margin), {
      width: imageSize,
      height: textHeight,
      continued: true
    });

    textsArray.forEach(function(textItem) {
      if (textItem.type === 'text') {
        currentText = currentText.fillColor('black');
      } else if (textItem.type === 'tag') {
        currentText = currentText.fillColor('blue');
      }

      currentText = currentText.text(textItem.text, {
        continued: true
      });
    });

    // reset text, nothing will be added
    currentText = currentText.text('', {
      continued: false
    });

    // here comes the text

    if (shouldCreateNewPage) {
      doc.addPage();
    }
  }
  try {

    yield* mapGen(printData, drawImage);

    // set cutting line for now
    doc
      .lineCap('butt')
      .moveTo(2 * margin + imageSize, 5)
      .lineTo(2 * margin + imageSize, pageHeight)
      .dash(5, {space: 5})
      .strokeColor('#eee')
      .stroke();

    doc.end();

    this.status = 200;
    this.type = 'application/pdf';
    this.body = doc;
  } catch (err) {
    this.throw(err);
  }
});

module.exports = router;
