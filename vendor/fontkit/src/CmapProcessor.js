// Generated by CoffeeScript 1.9.3
(function() {
  var CmapProcessor;

  CmapProcessor = (function() {
    function CmapProcessor(cmapTable) {
      var cmap, j, k, len, len1, ref, ref1, ref2;
      this._characterSet = null;
      ref = cmapTable.tables;
      for (j = 0, len = ref.length; j < len; j++) {
        cmap = ref[j];
        if ((cmap.platformID === 0 && ((ref1 = cmap.encodingID) === 4 || ref1 === 6)) || (cmap.platformID === 3 && cmap.encodingID === 10)) {
          this.cmap = cmap.table;
          return;
        }
      }
      ref2 = cmapTable.tables;
      for (k = 0, len1 = ref2.length; k < len1; k++) {
        cmap = ref2[k];
        if (cmap.platformID === 0 || (cmap.platformID === 3 && cmap.encodingID === 1)) {
          this.cmap = cmap.table;
          return;
        }
      }
      throw new Error("Could not find a unicode cmap");
    }

    CmapProcessor.prototype.lookup = function(codepoint) {
      var cmap, gid, group, index, max, mid, min, rangeOffset;
      cmap = this.cmap;
      switch (cmap.version) {
        case 0:
          return cmap.codeMap.get(codepoint) || 0;
        case 4:
          min = 0;
          max = cmap.segCount - 1;
          while (min <= max) {
            mid = (min + max) >> 1;
            if (codepoint < cmap.startCode.get(mid)) {
              max = mid - 1;
            } else if (codepoint > cmap.endCode.get(mid)) {
              min = mid + 1;
            } else {
              rangeOffset = cmap.idRangeOffset.get(mid);
              if (rangeOffset === 0) {
                gid = codepoint + cmap.idDelta.get(mid);
              } else {
                index = rangeOffset / 2 + (codepoint - cmap.startCode.get(mid)) - (cmap.segCount - mid);
                gid = cmap.glyphIndexArray.get(index) || 0;
                if (gid !== 0) {
                  gid += cmap.idDelta.get(mid);
                }
              }
              return gid & 0xffff;
            }
          }
          return 0;
        case 8:
          throw new Error('TODO: cmap format 8');
          break;
        case 6:
        case 10:
          return cmap.glyphIndices.get(codepoint - cmap.firstCode) || 0;
        case 12:
        case 13:
          min = 0;
          max = cmap.nGroups - 1;
          while (min <= max) {
            mid = (min + max) >> 1;
            group = cmap.groups.get(mid);
            if (codepoint < group.startCharCode) {
              max = mid - 1;
            } else if (codepoint > group.endCharCode) {
              min = mid + 1;
            } else {
              if (cmap.version === 12) {
                return group.glyphID + (codepoint - group.startCharCode);
              } else {
                return group.glyphID;
              }
            }
          }
          return 0;
        case 14:
          throw new Error('TODO: cmap format 14');
          break;
        default:
          throw new Error('Unknown cmap format ' + cmap.version);
      }
    };

    CmapProcessor.prototype.getCharacterSet = function() {
      var cmap, group, i, j, k, l, len, len1, m, n, o, ref, ref1, ref2, ref3, ref4, ref5, ref6, res, results, results1, results2, results3, start, tail;
      if (this._characterSet) {
        return this._characterSet;
      }
      cmap = this.cmap;
      switch (cmap.version) {
        case 0:
          this._characterSet = (function() {
            results = [];
            for (var j = 0, ref = cmap.codeMap.length; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--){ results.push(j); }
            return results;
          }).apply(this);
          break;
        case 4:
          res = [];
          ref1 = cmap.endCode.toArray();
          for (i = k = 0, len = ref1.length; k < len; i = ++k) {
            tail = ref1[i];
            start = cmap.startCode.get(i);
            res.push.apply(res, (function() {
              results1 = [];
              for (var l = start; start <= tail ? l <= tail : l >= tail; start <= tail ? l++ : l--){ results1.push(l); }
              return results1;
            }).apply(this));
          }
          this._characterSet = res;
          break;
        case 8:
          throw new Error('TODO: cmap format 8');
          break;
        case 6:
        case 10:
          this._characterSet = (function() {
            results2 = [];
            for (var m = ref2 = cmap.firstCode, ref3 = cmap.firstCode + cmap.glyphIndices.length; ref2 <= ref3 ? m < ref3 : m > ref3; ref2 <= ref3 ? m++ : m--){ results2.push(m); }
            return results2;
          }).apply(this);
          break;
        case 12:
        case 13:
          res = [];
          ref4 = cmap.groups.toArray();
          for (n = 0, len1 = ref4.length; n < len1; n++) {
            group = ref4[n];
            res.push.apply(res, (function() {
              results3 = [];
              for (var o = ref5 = group.startCharCode, ref6 = group.endCharCode; ref5 <= ref6 ? o <= ref6 : o >= ref6; ref5 <= ref6 ? o++ : o--){ results3.push(o); }
              return results3;
            }).apply(this));
          }
          this._characterSet = res;
          break;
        case 14:
          throw new Error('TODO: cmap format 14');
          break;
        default:
          throw new Error('Unknown cmap format ' + cmap.version);
      }
      return this._characterSet;
    };

    return CmapProcessor;

  })();

  module.exports = CmapProcessor;

}).call(this);
