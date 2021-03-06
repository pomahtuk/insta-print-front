// Generated by CoffeeScript 1.9.3
(function() {
  var r, shortFrac;

  r = require('restructure');

  shortFrac = new r.Fixed(16, 'BE', 14);

  module.exports = new r.Struct({
    version: r.uint16,
    reserved: new r.Reserved(r.uint16),
    axisCount: r.uint16,
    globalCoordCount: r.uint16,
    globalCoords: new r.Pointer(r.uint32, new r.Array(new r.Array(shortFrac, 'axisCount'), 'globalCoordCount')),
    glyphCount: r.uint16,
    flags: r.uint16,
    offsetToData: r.uint32
  });

  module.exports.process = function(stream) {
    var i, j, len, offset, ptr, ref, type;
    type = this.flags === 1 ? r.uint32 : r.uint16;
    ptr = new r.Pointer(type, 'void', {
      relativeTo: 'offsetToData',
      allowNull: false
    });
    this.offsets = new r.Array(ptr, this.glyphCount + 1).decode(stream, this);
    if (this.flags === 0) {
      ref = this.offsets;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        offset = ref[i];
        this.offsets[i] = offset * 2;
      }
    }
  };

}).call(this);
