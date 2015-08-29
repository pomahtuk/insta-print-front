// Generated by CoffeeScript 1.9.3
(function() {
  var GPOSProcessor, OpenTypeProcessor,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  OpenTypeProcessor = require('./OpenTypeProcessor');

  GPOSProcessor = (function(superClass) {
    extend(GPOSProcessor, superClass);

    function GPOSProcessor() {
      return GPOSProcessor.__super__.constructor.apply(this, arguments);
    }

    GPOSProcessor.prototype.applyPositionValue = function(sequenceIndex, value) {
      var position;
      position = this.positions[this.glyphIterator.peekIndex(sequenceIndex)];
      if (value.xAdvance != null) {
        position.xAdvance += value.xAdvance;
      }
      if (value.yAdvance != null) {
        position.yAdvance += value.yAdvance;
      }
      if (value.xPlacement != null) {
        position.xOffset += value.xPlacement;
      }
      if (value.yPlacement != null) {
        return position.yOffset += value.yPlacement;
      }
    };

    GPOSProcessor.prototype.applyLookup = function(lookupType, table) {
      var baseAnchor, baseGlyphIndex, baseIndex, class1, class2, compIndex, cur, curRecord, d, entry, exit, good, index, l, len, ligAttach, ligGlyph, ligIndex, mark1Index, mark2Index, markGlyph, markIndex, markRecord, next, nextGlyph, nextIndex, nextRecord, pair, prev, prevIndex, set;
      switch (lookupType) {
        case 1:
          index = this.coverageIndex(table.coverage);
          if (index === -1) {
            return false;
          }
          switch (table.version) {
            case 1:
              this.applyPositionValue(0, table.value);
              break;
            case 2:
              this.applyPositionValue(0, table.values.get(index));
          }
          return true;
        case 2:
          nextGlyph = this.glyphIterator.peek();
          if (!nextGlyph) {
            return false;
          }
          index = this.coverageIndex(table.coverage);
          if (index === -1) {
            return false;
          }
          switch (table.version) {
            case 1:
              set = table.pairSets.get(index);
              for (l = 0, len = set.length; l < len; l++) {
                pair = set[l];
                if (!(pair.secondGlyph === nextGlyph.id)) {
                  continue;
                }
                this.applyPositionValue(0, pair.value1);
                this.applyPositionValue(1, pair.value2);
                return true;
              }
              return false;
            case 2:
              class1 = this.getClassID(this.glyphIterator.cur.id, table.classDef1);
              class2 = this.getClassID(nextGlyph.id, table.classDef2);
              if (class1 === -1 || class2 === -1) {
                return false;
              }
              pair = table.classRecords.get(class1).get(class2);
              this.applyPositionValue(0, pair.value1);
              this.applyPositionValue(1, pair.value2);
          }
          return true;
        case 3:
          nextIndex = this.glyphIterator.peekIndex();
          nextGlyph = this.glyphs[nextIndex];
          if (!nextGlyph) {
            return false;
          }
          curRecord = table.entryExitRecords[this.coverageIndex(table.coverage)];
          if (!(curRecord != null ? curRecord.exitAnchor : void 0)) {
            return false;
          }
          nextRecord = table.entryExitRecords[this.coverageIndex(table.coverage, nextGlyph.id)];
          if (!(nextRecord != null ? nextRecord.entryAnchor : void 0)) {
            return false;
          }
          entry = this.getAnchor(nextRecord.entryAnchor);
          exit = this.getAnchor(curRecord.exitAnchor);
          cur = this.positions[this.glyphIterator.index];
          next = this.positions[nextIndex];
          switch (this.direction) {
            case 'ltr':
              cur.xAdvance = exit.x + cur.xOffset;
              d = entry.x + next.xOffset;
              next.xAdvance -= d;
              next.xOffset -= d;
              break;
            case 'rtl':
              d = exit.x + cur.xOffset;
              cur.xAdvance -= d;
              cur.xOffset -= d;
              next.xAdvance = entry.x + next.xOffset;
          }
          if (this.glyphIterator.flags.rightToLeft) {
            this.glyphIterator.cur.cursiveAttachment = nextIndex;
            cur.yOffset = entry.y - exit.y;
          } else {
            nextGlyph.cursiveAttachment = this.glyphIterator.index;
            cur.yOffset = exit.y - entry.y;
          }
          return true;
        case 4:
          markIndex = this.coverageIndex(table.markCoverage);
          if (markIndex === -1) {
            return false;
          }
          baseGlyphIndex = this.glyphIterator.index;
          while (--baseGlyphIndex >= 0) {
            if (!this.glyphs[baseGlyphIndex].isMark) {
              break;
            }
          }
          if (baseGlyphIndex < 0) {
            return false;
          }
          baseIndex = this.coverageIndex(table.baseCoverage, this.glyphs[baseGlyphIndex].id);
          if (baseIndex === -1) {
            return false;
          }
          markRecord = table.markArray[markIndex];
          baseAnchor = table.baseArray[baseIndex][markRecord["class"]];
          this.applyAnchor(markRecord, baseAnchor, baseGlyphIndex);
          return true;
        case 5:
          markIndex = this.coverageIndex(table.markCoverage);
          if (markIndex === -1) {
            return false;
          }
          baseGlyphIndex = this.glyphIterator.index;
          while (--baseGlyphIndex >= 0) {
            if (!this.glyphs[baseGlyphIndex].isMark) {
              break;
            }
          }
          if (baseGlyphIndex < 0) {
            return false;
          }
          ligIndex = this.coverageIndex(table.ligatureCoverage, this.glyphs[baseGlyphIndex].id);
          if (ligIndex === -1) {
            return false;
          }
          ligAttach = table.ligatureArray[ligIndex];
          markGlyph = this.glyphIterator.cur;
          ligGlyph = this.glyphs[baseGlyphIndex];
          compIndex = ligGlyph.ligatureID && ligGlyph.ligatureID === markGlyph.ligatureID && (markGlyph.ligatureComponent != null) ? Math.min(markGlyph.ligatureComponent, ligGlyph.codePoints.length) - 1 : ligGlyph.codePoints.length - 1;
          markRecord = table.markArray[markIndex];
          baseAnchor = ligAttach[compIndex][markRecord["class"]];
          this.applyAnchor(markRecord, baseAnchor, baseGlyphIndex);
          return true;
        case 6:
          mark1Index = this.coverageIndex(table.mark1Coverage);
          if (mark1Index === -1) {
            return false;
          }
          prevIndex = this.glyphIterator.peekIndex(-1);
          prev = this.glyphs[prevIndex];
          if (!(prev != null ? prev.isMark : void 0)) {
            return false;
          }
          cur = this.glyphIterator.cur;
          good = false;
          if (cur.ligatureID === prev.ligatureID) {
            if (!cur.ligatureID) {
              good = true;
            } else if (cur.ligatureComponent === prev.ligatureComponent) {
              good = true;
            }
          } else {
            if ((cur.ligatureID && !cur.ligatureComponent) || (prev.ligatureID && !prev.ligatureComponent)) {
              good = true;
            }
          }
          if (!good) {
            return false;
          }
          mark2Index = this.coverageIndex(table.mark2Coverage, prev.id);
          if (mark2Index === -1) {
            return false;
          }
          markRecord = table.mark1Array[mark1Index];
          baseAnchor = table.mark2Array[mark2Index][markRecord["class"]];
          this.applyAnchor(markRecord, baseAnchor, prevIndex);
          return true;
        case 7:
          this.applyContext(table);
          break;
        case 8:
          this.applyChainingContext(table);
          break;
        case 9:
          this.applyLookup(table.lookupType, table.extension);
          break;
        default:
          throw new Error("Unsupported GPOS table: " + lookupType);
      }
      return false;
    };

    GPOSProcessor.prototype.applyAnchor = function(markRecord, baseAnchor, baseGlyphIndex) {
      var baseCoords, basePos, markCoords, markPos;
      baseCoords = this.getAnchor(baseAnchor);
      markCoords = this.getAnchor(markRecord.markAnchor);
      basePos = this.positions[baseGlyphIndex];
      markPos = this.positions[this.glyphIterator.index];
      markPos.xOffset = baseCoords.x - markCoords.x;
      markPos.yOffset = baseCoords.y - markCoords.y;
      return this.glyphIterator.cur.markAttachment = baseGlyphIndex;
    };

    GPOSProcessor.prototype.getAnchor = function(anchor) {
      return {
        x: anchor.xCoordinate,
        y: anchor.yCoordinate
      };
    };

    GPOSProcessor.prototype.applyFeatures = function() {
      var glyph, i, l, len, ref;
      GPOSProcessor.__super__.applyFeatures.apply(this, arguments);
      ref = this.glyphs;
      for (i = l = 0, len = ref.length; l < len; i = ++l) {
        glyph = ref[i];
        this.fixCursiveAttachment(i);
      }
      return this.fixMarkAttachment(i);
    };

    GPOSProcessor.prototype.fixCursiveAttachment = function(i) {
      var glyph, j;
      glyph = this.glyphs[i];
      if (glyph.cursiveAttachment != null) {
        j = glyph.cursiveAttachment;
        glyph.cursiveAttachment = null;
        this.fixCursiveAttachment(j);
        return this.positions[i].yOffset += this.positions[j].yOffset;
      }
    };

    GPOSProcessor.prototype.fixMarkAttachment = function() {
      var glyph, i, j, k, l, len, m, ref, ref1, ref2;
      ref = this.glyphs;
      for (i = l = 0, len = ref.length; l < len; i = ++l) {
        glyph = ref[i];
        if (!(glyph.markAttachment != null)) {
          continue;
        }
        j = glyph.markAttachment;
        this.positions[i].xOffset += this.positions[j].xOffset;
        this.positions[i].yOffset += this.positions[j].yOffset;
        if (this.direction === 'ltr') {
          for (k = m = ref1 = j, ref2 = i; m < ref2; k = m += 1) {
            this.positions[i].xOffset -= this.positions[k].xAdvance;
            this.positions[i].yOffset -= this.positions[k].yAdvance;
          }
        }
      }
    };

    return GPOSProcessor;

  })(OpenTypeProcessor);

  module.exports = GPOSProcessor;

}).call(this);