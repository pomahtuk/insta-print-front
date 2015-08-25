const router = require('koa-router')();
const PDFDocument = require('pdfkit');
const request = require('koa-request').defaults({ encoding: null });
const fs = require('fs');
const path = require('path');
const os = require('os');
const util = require('util');
const twitter = require('twitter-text');
const models = require('../models');
const Event = models.Event;
const constants = require('../constants');

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
var mockPrintData = require('../mocks/printRequest.js');

const fontRegularPath = path.normalize(path.join(__dirname, '/../../client/fonts/Roboto-Regular.ttf'));

// allow iterate over object making async calls
function* mapGen (arr, callback) {
  var pritingItem = null;
  var counter = 0;
  var arrayLength = arr.length;
  var i = 0, j = 0;

  for (i = 0; i < arrayLength; i++) {
    pritingItem = arr[i];
    // if we requested only one copy or using mock data
    // just envoke a callback
    if (!pritingItem.countAdded || pritingItem.countAdded === 1) {
      counter += 1;
      yield callback(pritingItem, counter);
    } else {
      // if we requested several copies - call few callbacks
      for (j = 0; j < pritingItem.countAdded; j++) {
        counter += 1;
        yield callback(pritingItem, counter);
      }
    }
  }
}

function getPrintDataSize(images) {
  var result = 0;
  images.forEach(function(image) {
    result += image.countAdded ? image.countAdded : 1;
  });
  return result;
}

function* printerFunction(printData) {
  var images = printData.images;
  var fileName = path.join(os.tmpdir(), '/print' + Date.now() + '.pdf');
  var doc = new PDFDocument({
    layout: 'landscape',
    size: [pageHeight, pageWidth]
  });
  doc.pipe(fs.createWriteStream(fileName));

  doc.registerFont('Roboto', fontRegularPath);

  var printDataSize = getPrintDataSize(images);

  if (printDataSize < 0) {
    finalizeDocument();
    return fileName;
  }

  function recurseExtract(text, searchArr, i, container) {
    // no text left
    // or no tags found
    if (!text) return;

    var search = searchArr ? searchArr[i] : null;

    if (!search) {
      // no tags found in text
      container.push({
        text: text,
        type: 'text'
      });

      // do not go further
      return;

    } else {
      // { hashtag: 'лето', indices: [ 90, 95 ] },
      var searchTag = '#' + search.hashtag;
      var splittingArr = text.split(searchTag) || [];
      var index = text.indexOf(searchTag);
      if (index === 0) {
        container.push({
          text: searchTag,
          type: 'tag'
        });
        container.push({
          text: splittingArr[0],
          type: 'text'
        });
      } else if (index !== 0) {
        container.push({
          text: splittingArr[0],
          type: 'text'
        });
        container.push({
          text: searchTag,
          type: 'tag'
        });
      }
      recurseExtract(splittingArr[1], searchArr, i += 1, container);
    }

  }

  function extractHashTags(text) {
    // here we have a hashtags
    // using twitter one for better extraction
    var hashTagsArray = twitter.extractHashtagsWithIndices(text);
    var resultArray = [];

    recurseExtract(text, hashTagsArray, 0, resultArray);

    return resultArray;
  }

  function finalizeDocument() {
    // set cutting line for now
    doc
      .lineCap('butt')
      .moveTo(2 * margin + imageSize, 5)
      .lineTo(2 * margin + imageSize, pageHeight)
      .dash(5, {space: 5})
      .strokeColor('#eee')
      .stroke();

    doc.end();

    // for now
    console.log(fileName);

  }

  function* drawImage (image, index) {
    var divisionLeftover = (index - 1) % 2;
    var shouldCreateNewPage = (printDataSize - index) > 0 && divisionLeftover === 1;
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
      // in other case we have nothing to draw
      // and huge space will be drawn
      if (textItem.text.length > 0) {
        if (textItem.type === 'text') {
          currentText = currentText.fillColor('black');
        } else if (textItem.type === 'tag') {
          currentText = currentText.fillColor('blue');
        }
        currentText = currentText.text(textItem.text, {
          continued: true
        });
      }
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

  yield* mapGen(images, drawImage);

  finalizeDocument();

  return fileName;
}


//main functuon
router.post('/printer', function* () {
  var printingData = this.request.body;
  var dbRecord = null;

  try {
    var fileName = yield printerFunction(printingData);

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
      data: printingData
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
