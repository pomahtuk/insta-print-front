// Generated by CoffeeScript 1.9.3
(function() {
  var BslnSubtable, LookupTable, r;

  r = require('restructure');

  LookupTable = require('./aat').LookupTable;

  BslnSubtable = new r.VersionedStruct('format', {
    0: {
      deltas: new r.Array(r.int16, 32)
    },
    1: {
      deltas: new r.Array(r.int16, 32),
      mappingData: new LookupTable(r.uint16)
    },
    2: {
      standardGlyph: r.uint16,
      controlPoints: new r.Array(r.uint16, 32)
    },
    3: {
      standardGlyph: r.uint16,
      controlPoints: new r.Array(r.uint16, 32),
      mappingData: new LookupTable(r.uint16)
    }
  });

  module.exports = new r.Struct({
    version: r.fixed32,
    format: r.uint16,
    defaultBaseline: r.uint16,
    subtable: BslnSubtable
  });

}).call(this);
