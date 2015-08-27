r = require 'restructure'
EBDT = require './EBDT'

SBitLineMetrics = new r.Struct
  ascender: r.int8
  descender: r.int8
  widthMax: r.uint8
  caretSlopeNumerator: r.int8
  caretSlopeDenominator: r.int8
  caretOffset: r.int8
  minOriginSB: r.int8
  minAdvanceSB: r.int8
  maxBeforeBL: r.int8
  minAfterBL: r.int8
  pad: new r.Reserved(r.int8, 2)
  
CodeOffsetPair = new r.Struct
  glyphCode: r.uint16
  offset: r.uint16
  
IndexSubtable = new r.VersionedStruct r.uint16,
  header:
    imageFormat: r.uint16
    imageDataOffset: r.uint32
    
  1:
    offsetArray: new r.Array(r.uint32, -> @parent.lastGlyphIndex - @parent.firstGlyphIndex + 1)
    
  2:
    imageSize: r.uint32
    bigMetrics: EBDT.BigMetrics
    
  3:
    offsetArray: new r.Array(r.uint16,  -> @parent.lastGlyphIndex - @parent.firstGlyphIndex + 1)
    
  4:
    numGlyphs: r.uint32
    glyphArray: new r.Array(CodeOffsetPair, -> @numGlyphs + 1)
    
  5:
    imageSize: r.uint32
    bigMetrics: EBDT.BigMetrics
    numGlyphs: r.uint32
    glyphCodeArray: new r.Array(r.uint16, 'numGlyphs')
  
IndexSubtableArray = new r.Struct
  firstGlyphIndex: r.uint16
  lastGlyphIndex: r.uint16
  subtable: new r.Pointer(r.uint32, IndexSubtable)

BitmapSizeTable = new r.Struct
  indexSubTableArray: new r.Pointer(r.uint32, new r.Array(IndexSubtableArray, 1), type: 'parent')
  indexTablesSize: r.uint32
  numberOfIndexSubTables: r.uint32
  colorRef: r.uint32
  hori: SBitLineMetrics
  vert: SBitLineMetrics
  startGlyphIndex: r.uint16
  endGlyphIndex: r.uint16
  ppemX: r.uint8
  ppemY: r.uint8
  bitDepth: r.uint8
  flags: new r.Bitfield r.uint8, ['horizontal', 'vertical']

module.exports = new r.Struct
  version:  r.uint32 # 0x00020000
  numSizes: r.uint32
  sizes:    new r.Array(BitmapSizeTable, 'numSizes')
