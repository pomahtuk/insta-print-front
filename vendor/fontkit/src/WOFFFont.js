// Generated by CoffeeScript 1.9.3
(function() {
  var TTFFont, WOFFDirectory, WOFFFont, pako, r, tables, toBuffer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TTFFont = require('./TTFFont');

  WOFFDirectory = require('./tables/WOFFDirectory');

  tables = require('./tables');

  pako = require('pako/lib/inflate');

  toBuffer = require('typedarray-to-buffer');

  r = require('restructure');

  WOFFFont = (function(superClass) {
    extend(WOFFFont, superClass);

    function WOFFFont() {
      return WOFFFont.__super__.constructor.apply(this, arguments);
    }

    WOFFFont.probe = function(buffer) {
      return buffer.toString('ascii', 0, 4) === 'wOFF';
    };

    WOFFFont.prototype._decodeDirectory = function() {
      return this.directory = WOFFDirectory.decode(this.stream, {
        _startOffset: 0
      });
    };

    WOFFFont.prototype._getTableStream = function(tag) {
      var buf, table;
      table = this.directory.tables[tag];
      if (table) {
        this.stream.pos = table.offset;
        if (table.compLength < table.origLength) {
          buf = toBuffer(pako.inflate(this.stream.readBuffer(table.compLength)));
          return new r.DecodeStream(buf);
        } else {
          return this.stream;
        }
      }
      return null;
    };

    WOFFFont.prototype._decodeTable = function(table) {
      return tables[table.tag].decode(this._getTableStream(table.tag), this, table.origLength);
    };

    return WOFFFont;

  })(TTFFont);

  module.exports = WOFFFont;

}).call(this);
