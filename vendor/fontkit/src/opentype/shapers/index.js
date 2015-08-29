// Generated by CoffeeScript 1.9.3
(function() {
  var ArabicShaper, DefaultShaper, HangulShaper, SHAPERS;

  DefaultShaper = require('./DefaultShaper');

  ArabicShaper = require('./ArabicShaper');

  HangulShaper = require('./HangulShaper');

  SHAPERS = {
    arab: ArabicShaper,
    mong: ArabicShaper,
    syrc: ArabicShaper,
    'nko ': ArabicShaper,
    phag: ArabicShaper,
    mand: ArabicShaper,
    mani: ArabicShaper,
    phlp: ArabicShaper,
    hang: HangulShaper,
    latn: DefaultShaper,
    DFLT: DefaultShaper
  };

  exports.choose = function(script) {
    var shaper;
    shaper = SHAPERS[script];
    if (shaper) {
      return shaper;
    }
    return DefaultShaper;
  };

}).call(this);