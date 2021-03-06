// Generated by CoffeeScript 1.9.3
(function() {
  var GSUBProcessor, GlyphInfo, OpenTypeProcessor,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  OpenTypeProcessor = require('./OpenTypeProcessor');

  GlyphInfo = require('./GlyphInfo');

  GSUBProcessor = (function(superClass) {
    extend(GSUBProcessor, superClass);

    function GSUBProcessor() {
      return GSUBProcessor.__super__.constructor.apply(this, arguments);
    }

    GSUBProcessor.prototype.applyLookup = function(lookupType, table) {
      var USER_INDEX, characters, curComps, curGlyph, g, gid, glyph, i, idx, index, j, k, l, lastLigID, lastNumComps, len, len1, len2, len3, ligature, ligatureComponent, ligatureGlyph, m, matchIndex, matched, n, o, ref, ref1, ref2, ref3, ref4, replacement, sequence;
      switch (lookupType) {
        case 1:
          index = this.coverageIndex(table.coverage);
          if (index === -1) {
            return false;
          }
          glyph = this.glyphIterator.cur;
          switch (table.version) {
            case 1:
              glyph.id = (glyph.id + table.deltaGlyphID) & 0xffff;
              break;
            case 2:
              glyph.id = table.substitute.get(index);
          }
          return true;
        case 2:
          index = this.coverageIndex(table.coverage);
          if (index !== -1) {
            sequence = table.sequences.get(index);
            this.glyphIterator.cur.id = sequence[0];
            replacement = [];
            ref = sequence.slice(1);
            for (j = 0, len = ref.length; j < len; j++) {
              gid = ref[j];
              g = new GlyphInfo(gid);
              g.features = this.glyphIterator.cur.features;
              replacement.push(g);
            }
            (ref1 = this.glyphs).splice.apply(ref1, [this.glyphIterator.index + 1, 0].concat(slice.call(replacement)));
            return true;
          }
          break;
        case 3:
          index = this.coverageIndex(table.coverage);
          if (index !== -1) {
            USER_INDEX = 0;
            this.glyphIterator.cur.id = table.alternateSet.get(index)[USER_INDEX];
            return true;
          }
          break;
        case 4:
          index = this.coverageIndex(table.coverage);
          if (index === -1) {
            return false;
          }
          ref2 = table.ligatureSets.get(index);
          for (k = 0, len1 = ref2.length; k < len1; k++) {
            ligature = ref2[k];
            matched = this.sequenceMatchIndices(1, ligature.components);
            if (!matched) {
              continue;
            }
            curGlyph = this.glyphIterator.cur;
            characters = slice.call(curGlyph.codePoints);
            for (l = 0, len2 = matched.length; l < len2; l++) {
              index = matched[l];
              characters.push.apply(characters, this.glyphs[index].codePoints);
            }
            ligatureGlyph = new GlyphInfo(ligature.glyph, characters);
            ligatureGlyph.features = curGlyph.features;
            ligatureGlyph.ligatureID = ligatureGlyph.isMark ? 0 : this.ligatureID++;
            lastLigID = curGlyph.ligatureID;
            lastNumComps = curGlyph.codePoints.length;
            curComps = lastNumComps;
            idx = this.glyphIterator.index + 1;
            for (m = 0, len3 = matched.length; m < len3; m++) {
              matchIndex = matched[m];
              if (ligatureGlyph.isMark) {
                idx = matchIndex;
              } else {
                while (idx < matchIndex) {
                  ligatureComponent = curComps - lastNumComps + Math.min(this.glyphs[idx].ligatureComponent || 1, lastNumComps);
                  this.glyphs[idx].ligatureID = ligatureGlyph.ligatureID;
                  this.glyphs[idx].ligatureComponent = ligatureComponent;
                  idx++;
                }
              }
              lastLigID = this.glyphs[idx].ligatureID;
              lastNumComps = this.glyphs[idx].codePoints.length;
              curComps += lastNumComps;
              idx++;
            }
            if (lastLigID && !ligatureGlyph.isMark) {
              for (i = n = ref3 = idx, ref4 = this.glyphs.length; n < ref4; i = n += 1) {
                if (this.glyphs[i].ligatureID === lastLigID) {
                  ligatureComponent = curComps - lastNumComps + Math.min(this.glyphs[i].ligatureComponent || 1, lastNumComps);
                  this.glyphs[i].ligatureComponent = ligatureComponent;
                } else {
                  break;
                }
              }
            }
            for (o = matched.length - 1; o >= 0; o += -1) {
              index = matched[o];
              this.glyphs.splice(index, 1);
            }
            this.glyphs[this.glyphIterator.index] = ligatureGlyph;
            return true;
          }
          break;
        case 5:
          this.applyContext(table);
          break;
        case 6:
          this.applyChainingContext(table);
          break;
        case 7:
          this.applyLookup(table.lookupType, table.extension);
          break;
        default:
          throw new Error("GSUB lookupType " + lookupType + " is not supported");
      }
      return false;
    };

    return GSUBProcessor;

  })(OpenTypeProcessor);

  module.exports = GSUBProcessor;

}).call(this);
