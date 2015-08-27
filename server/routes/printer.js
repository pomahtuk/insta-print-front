const router = require('koa-router')();
// const PDFDocument = require('../../../pdfkit');
const PDFDocument = require('pdfkit');
const fontkit = require('../../vendor/fontkit');
const request = require('koa-request').defaults({ encoding: null });
const fs = require('fs');
const path = require('path');
const os = require('os');
const util = require('util');
const twitter = require('twitter-text');
const models = require('../models');
const Event = models.Event;
const constants = require('../constants');
const emojiRegex = require('emoji-regex');

// set conversion values
const mmToPixel = 3.779527559055;
const mmToInch = 0.0393700787;
// sizes setup
const imageSize = 70.2 * mmToPixel;
const textHeight = 20.4 * mmToPixel;
const margin = 3 * mmToPixel;
const pageHeight = 101.6 * mmToPixel;
const pageWidth = 152.4 * mmToPixel;

// mock data
var mockPrintData = require('../mocks/printRequest.js');

const fontRegularPath = path.normalize(path.join(__dirname, '/../../client/fonts/Roboto-Regular.ttf'));
// this will be treted differently
const fontEmojiBWPath = path.normalize(path.join(__dirname, '/../../client/fonts/SegoeUISymbol.ttf'));
const fontEmojiColorPath = path.normalize(path.join(__dirname, '/../../client/fonts/color_emoji.ttf'));

const emojiFontKitFont = fontkit.openSync(fontEmojiColorPath);

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

// thx to MDN
function knownCharCodeAt(str, idx) {
  str += '';
  var code,
      end = str.length;

  var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  while ((surrogatePairs.exec(str)) != null) {
    var li = surrogatePairs.lastIndex;
    if (li - 2 < idx) {
      idx++;
    }
    else {
      break;
    }
  }

  if (idx >= end || idx < 0) {
    return NaN;
  }

  code = str.charCodeAt(idx);

  var hi, low;
  if ((code >= 0xD800) && (code <= 0xDBFF)) {
    hi = code;
    low = str.charCodeAt(idx + 1);
    // Go one further, since one of the "characters" is part of a surrogate pair
    return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
  }

  //return unicode representation
  return code;
}


function* printerFunction(printData) {
  var images = printData.images;
  var fileName = path.join(os.tmpdir(), '/print' + Date.now() + '.pdf');
  var doc = new PDFDocument({
    layout: 'landscape',
    size: [pageHeight, pageWidth]
  });
  doc.pipe(fs.createWriteStream(fileName));

  doc.registerFont('Main', fontRegularPath);
  doc.registerFont('Emoji', fontEmojiBWPath);

  createDashedLine();

  var printDataSize = getPrintDataSize(images);

  if (printDataSize < 0) {
    finalizeDocument();
    return fileName;
  }

  function getCurrentStringOnLine(currentTotalString, newString) {
    // if (newString.indexOf(' ') !== 0) {
    //   newString = ' ' + newString;
    // }
    currentTotalString += newString;

    if (doc.widthOfString(currentTotalString) > imageSize) {
      console.log('new line! :', currentTotalString);
      // new line!!!
      // inaccurate right now
      var totalArr = currentTotalString.split(' ');
      var lastIndex = 0;
      var lastTotal = '';
      totalArr.every(function(word, index) {
        lastTotal += index < totalArr.length - 1 ? word + ' ' : word;
        if (doc.widthOfString(lastTotal + word) > imageSize) {
          lastIndex = index + 1;
          return false;
        } else {
          return true;
        }
      });
      lastTotal = totalArr.splice(lastIndex, totalArr.length);
      lastTotal = lastTotal.join(' ');
      currentTotalString = lastTotal;
      console.log('new line! leftover:', currentTotalString);
    }

    return currentTotalString;
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
        type: 'text',
        isEmoji: false
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
          type: 'tag',
          isEmoji: false
        });
        container.push({
          text: splittingArr[0],
          type: 'text',
          isEmoji: false
        });
      } else if (index !== 0) {
        container.push({
          text: splittingArr[0],
          type: 'text',
          isEmoji: false
        });
        container.push({
          text: searchTag,
          type: 'tag',
          isEmoji: false
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

  function extractEmojis(textsArray) {
    var finalArray = [];

    textsArray.forEach(function(textsArrayElem) {
      var text = textsArrayElem.text;
      var hasEmojs = emojiRegex().test(text);
      var positionsArray = [];

      if (hasEmojs) {
        // getting all positions
        text.replace(emojiRegex(), function(match, position) {
          positionsArray.push(position);
          return match;
        });

        finalArray.push({
          text: text.slice(0, positionsArray[0]),
          type: textsArrayElem.type,
          isEmoji: false
        });

        positionsArray.forEach(function(emojiPosition, index) {
          var emojiLength = 3;
          // pushing emoji itself
          var emoji = text.slice(positionsArray[index], positionsArray[index] + emojiLength);
          var emojiCode  = knownCharCodeAt(emoji, 0);
          emojiCode = emojiCode.toString(16);

          // exlude codes
          if (emojiCode && emojiCode !== 'undefined' && emojiCode !== '1f3fc') {
            finalArray.push({
              text: emoji,
              emojiCode: emojiCode,
              type: textsArrayElem.type,
              isEmoji: true
            });
          }

          if (index < positionsArray.length - 2) {
            // pushing rest text
            finalArray.push({
              text: text.slice(positionsArray[index] + emojiLength, positionsArray[index + 1]),
              type: textsArrayElem.type,
              isEmoji: false
            });
          }
        });

      } else {
        finalArray.push(textsArrayElem);
      }
    });

    return finalArray;
  }

  function createDashedLine() {
    // set cutting line for now
    doc
      .lineCap('butt')
      .moveTo(2 * margin + imageSize, 5)
      .lineTo(2 * margin + imageSize, pageHeight)
      .dash(5, {space: 5})
      .strokeColor('#eee')
      .stroke();

  }

  function finalizeDocument() {
    doc.end();
    // for now
    console.log(fileName);

  }

  function* drawImage (image, index) {
    // global
    var emojisPositions = [];
    var currentTotalString = '';

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
    // use different font for emoji
    var newTextsArray = extractEmojis(textsArray);

    doc.font('Main');
    doc.fontSize(10);
    doc.moveTo(0, 0);

    var currentText = doc.text('', leftOffset, imageSize + (2 * margin), {
      width: imageSize,
      height: textHeight,
      continued: true
    });

    newTextsArray.forEach(function(textItem) {
      // in other case we have nothing to draw
      // and huge space will be drawn
      if (textItem.text.length > 0) {
        currentText = currentText.font('Main');
        currentText = currentText.fillColor('black');

        if (textItem.isEmoji) {
          var image = path.normalize(path.join(__dirname, '/../../client/images/apple/' + textItem.emojiCode + '.png'));

          // set transparent color and replace with something 1-symbol wired?
          currentText = currentText.fillColor('white');

          // save position
          emojisPositions.push({
            symbol: textItem.text,
            image: image,
            // this calculation sucks badly
            x: leftOffset + doc.widthOfString(currentTotalString),
            y: currentText.y
          });

          // textItem.text = ' m ';
        }

        if (textItem.type === 'tag') {
          currentText = currentText.fillColor('blue');
        }

        currentTotalString = getCurrentStringOnLine(currentTotalString, textItem.text);

        currentText = currentText.text(textItem.text, {
          continued: true
        });
      }
    });

    // reset text, nothing will be added
    currentText = currentText.text('', {
      continued: false
    });

    emojisPositions.forEach(function (emojiPosition, index) {
      doc.image(emojiPosition.image, emojiPosition.x, emojiPosition.y, {
        width: 10
      });
    });

    if (shouldCreateNewPage) {
      doc.addPage();
      createDashedLine();
    }

    // console.log(emojisPositions);
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

    // dbRecord = yield Event.create({
    //   eventType: constants.EVENT_TYPES.PHOTO_PRINTED,
    //   data: JSON.stringify(printingData)
    // });

    this.status = 200;
    this.type = 'application/pdf';
    this.body = {
      output: fileName
    };
  } catch (err) {

    // dbRecord = yield Event.create({
    //   eventType: constants.EVENT_TYPES.PHOTO_FAIL,
    //   data: JSON.stringify(printingData)
    // });

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
