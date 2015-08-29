// Generated by CoffeeScript 1.9.3
(function() {
  var r;

  r = require('restructure');

  module.exports = new r.VersionedStruct('head.indexToLocFormat', {
    0: {
      offsets: new r.Array(r.uint16)
    },
    1: {
      offsets: new r.Array(r.uint32)
    }
  });

  module.exports.process = function() {
    var i, j, ref, results;
    if (this.version !== 0) {
      return;
    }
    results = [];
    for (i = j = 0, ref = this.offsets.length; j < ref; i = j += 1) {
      results.push(this.offsets[i] <<= 1);
    }
    return results;
  };

  module.exports.preEncode = function() {
    var i, j, ref, results;
    if (this.version != null) {
      return;
    }
    this.version = this.offsets[this.offsets.length - 1] > 0xffff ? 1 : 0;
    if (this.version !== 0) {
      return;
    }
    results = [];
    for (i = j = 0, ref = this.offsets.length; j < ref; i = j += 1) {
      results.push(this.offsets[i] >>>= 1);
    }
    return results;
  };

}).call(this);