// Generated by CoffeeScript 1.9.3
(function() {
  var r;

  r = require('restructure');

  module.exports = new r.VersionedStruct(r.int32, {
    header: {
      italicAngle: r.fixed32,
      underlinePosition: r.int16,
      underlineThickness: r.int16,
      isFixedPitch: r.uint32,
      minMemType42: r.uint32,
      maxMemType42: r.uint32,
      minMemType1: r.uint32,
      maxMemType1: r.uint32
    },
    0x00010000: {},
    0x00020000: {
      numberOfGlyphs: r.uint16,
      glyphNameIndex: new r.Array(r.uint16, 'numberOfGlyphs'),
      names: new r.Array(new r.String(r.uint8))
    },
    0x00025000: {
      numberOfGlyphs: r.uint16,
      offsets: new r.Array(r.uint8, 'numberOfGlyphs')
    },
    0x00030000: {},
    0x00040000: {
      map: new r.Array(r.uint32, function() {
        return this.parent.maxp.numGlyphs;
      })
    }
  });

}).call(this);