// Generated by CoffeeScript 1.9.3
(function() {
  var CFFIndex, r;

  r = require('restructure');

  CFFIndex = (function() {
    function CFFIndex(type1) {
      this.type = type1;
    }

    CFFIndex.prototype.decode = function(stream, parent) {
      var count, end, i, j, offSize, offsetType, pos, ref, ret, start, startPos;
      count = stream.readUInt16BE();
      if (count === 0) {
        return [];
      }
      offSize = stream.readUInt8();
      offsetType = (function() {
        switch (offSize) {
          case 1:
            return r.uint8;
          case 2:
            return r.uint16;
          case 3:
            return r.uint24;
          case 4:
            return r.uint32;
          default:
            throw new Error("Bad offset size in CFFIndex: " + offSize + " " + stream.pos);
        }
      })();
      ret = [];
      startPos = stream.pos + ((count + 1) * offSize) - 1;
      start = offsetType.decode(stream);
      for (i = j = 0, ref = count; j < ref; i = j += 1) {
        end = offsetType.decode(stream);
        if (this.type != null) {
          pos = stream.pos;
          stream.pos = startPos + start;
          parent.length = end - start;
          ret.push(this.type.decode(stream, parent));
          stream.pos = pos;
        } else {
          ret.push({
            offset: startPos + start,
            length: end - start
          });
        }
        start = end;
      }
      stream.pos = startPos + start;
      return ret;
    };

    CFFIndex.prototype.size = function(arr, parent) {
      var item, j, len, offset, offsetType, size, type;
      size = 2;
      if (arr.length === 0) {
        return size;
      }
      type = this.type || new r.Buffer;
      offset = 1;
      for (j = 0, len = arr.length; j < len; j++) {
        item = arr[j];
        offset += type.size(item, parent);
      }
      offsetType = (function() {
        if (offset <= 0xff) {
          return r.uint8;
        } else if (offset <= 0xffff) {
          return r.uint16;
        } else if (offset <= 0xffffff) {
          return r.uint24;
        } else if (offset <= 0xffffffff) {
          return r.uint32;
        } else {
          throw new Error("Bad offset in CFFIndex");
        }
      })();
      size += 1 + offsetType.size() * (arr.length + 1);
      size += offset - 1;
      return size;
    };

    CFFIndex.prototype.encode = function(stream, arr, parent) {
      var i, item, j, k, l, len, len1, len2, offset, offsetType, s, sizes, type;
      stream.writeUInt16BE(arr.length);
      if (arr.length === 0) {
        return;
      }
      type = this.type || new r.Buffer;
      sizes = [];
      offset = 1;
      for (j = 0, len = arr.length; j < len; j++) {
        item = arr[j];
        s = type.size(item, parent);
        sizes.push(s);
        offset += s;
      }
      offsetType = (function() {
        if (offset <= 0xff) {
          return r.uint8;
        } else if (offset <= 0xffff) {
          return r.uint16;
        } else if (offset <= 0xffffff) {
          return r.uint24;
        } else if (offset <= 0xffffffff) {
          return r.uint32;
        } else {
          throw new Error("Bad offset in CFFIndex");
        }
      })();
      stream.writeUInt8(offsetType.size());
      offset = 1;
      offsetType.encode(stream, offset);
      for (i = k = 0, len1 = arr.length; k < len1; i = ++k) {
        item = arr[i];
        offset += sizes[i];
        offsetType.encode(stream, offset);
      }
      for (l = 0, len2 = arr.length; l < len2; l++) {
        item = arr[l];
        type.encode(stream, item, parent);
      }
    };

    return CFFIndex;

  })();

  module.exports = CFFIndex;

}).call(this);