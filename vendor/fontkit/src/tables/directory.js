// Generated by CoffeeScript 1.9.3
(function() {
  var Directory, TableEntry, Tables, r;

  r = require('restructure');

  Tables = require('./');

  TableEntry = new r.Struct({
    tag: new r.String(4),
    checkSum: r.uint32,
    offset: new r.Pointer(r.uint32, 'void', {
      type: 'global'
    }),
    length: r.uint32
  });

  Directory = new r.Struct({
    tag: new r.String(4),
    numTables: r.uint16,
    searchRange: r.uint16,
    entrySelector: r.uint16,
    rangeShift: r.uint16,
    tables: new r.Array(TableEntry, 'numTables')
  });

  Directory.process = function() {
    var i, len, ref, table, tables;
    tables = {};
    ref = this.tables;
    for (i = 0, len = ref.length; i < len; i++) {
      table = ref[i];
      tables[table.tag] = table;
    }
    return this.tables = tables;
  };

  Directory.preEncode = function(stream) {
    var ref, table, tables, tag;
    tables = [];
    ref = this.tables;
    for (tag in ref) {
      table = ref[tag];
      if (table != null) {
        tables.push({
          tag: tag,
          checkSum: 0,
          offset: new r.VoidPointer(Tables[tag], table),
          length: Tables[tag].size(table)
        });
      }
    }
    this.tag = 'true';
    this.numTables = tables.length;
    this.tables = tables;
    this.searchRange = Math.floor(Math.log(this.numTables) / Math.LN2) * 16;
    this.entrySelector = Math.floor(this.searchRange / Math.LN2);
    return this.rangeShift = this.numTables * 16 - this.searchRange;
  };

  module.exports = Directory;

}).call(this);