// Generated by CoffeeScript 1.9.3
(function() {
  var TTFGlyph, WOFF2Glyph,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TTFGlyph = require('./TTFGlyph');

  WOFF2Glyph = (function(superClass) {
    extend(WOFF2Glyph, superClass);

    function WOFF2Glyph() {
      return WOFF2Glyph.__super__.constructor.apply(this, arguments);
    }

    WOFF2Glyph.prototype._decode = function() {
      return this._font._transformedGlyphs[this.id];
    };

    WOFF2Glyph.prototype._getCBox = function() {
      return this.path.bbox;
    };

    return WOFF2Glyph;

  })(TTFGlyph);

  module.exports = WOFF2Glyph;

}).call(this);
