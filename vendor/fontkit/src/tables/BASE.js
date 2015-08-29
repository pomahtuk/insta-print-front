// Generated by CoffeeScript 1.9.3
(function() {
  var Axis, BaseCoord, BaseLangSysRecord, BaseScript, BaseScriptList, BaseScriptRecord, BaseTagList, BaseValues, ClassDef, Coverage, Device, FeatMinMaxRecord, FeatureList, LookupList, MinMax, ScriptList, r, ref;

  r = require('restructure');

  ref = require('./opentype'), ScriptList = ref.ScriptList, FeatureList = ref.FeatureList, LookupList = ref.LookupList, Coverage = ref.Coverage, ClassDef = ref.ClassDef, Device = ref.Device;

  BaseCoord = new r.VersionedStruct(r.uint16, {
    1: {
      coordinate: r.int16
    },
    2: {
      coordinate: r.int16,
      referenceGlyph: r.uint16,
      baseCoordPoint: r.uint16
    },
    3: {
      coordinate: r.int16,
      deviceTable: new r.Pointer(r.uint16, Device)
    }
  });

  BaseValues = new r.Struct({
    defaultIndex: r.uint16,
    baseCoordCount: r.uint16,
    baseCoords: new r.Array(new r.Pointer(r.uint16, BaseCoord), 'baseCoordCount')
  });

  FeatMinMaxRecord = new r.Struct({
    tag: new r.String(4),
    minCoord: new r.Pointer(r.uint16, BaseCoord, {
      type: 'parent'
    }),
    maxCoord: new r.Pointer(r.uint16, BaseCoord, {
      type: 'parent'
    })
  });

  MinMax = new r.Struct({
    minCoord: new r.Pointer(r.uint16, BaseCoord),
    maxCoord: new r.Pointer(r.uint16, BaseCoord),
    featMinMaxCount: r.uint16,
    featMinMaxRecords: new r.Array(FeatMinMaxRecord, 'featMinMaxCount')
  });

  BaseLangSysRecord = new r.Struct({
    tag: new r.String(4),
    minMax: new r.Pointer(r.uint16, MinMax, {
      type: 'parent'
    })
  });

  BaseScript = new r.Struct({
    baseValues: new r.Pointer(r.uint16, BaseValues),
    defaultMinMax: new r.Pointer(r.uint16, MinMax),
    baseLangSysCount: r.uint16,
    baseLangSysRecords: new r.Array(BaseLangSysRecord, 'baseLangSysCount')
  });

  BaseScriptRecord = new r.Struct({
    tag: new r.String(4),
    script: new r.Pointer(r.uint16, BaseScript, {
      type: 'parent'
    })
  });

  BaseScriptList = new r.Array(BaseScriptRecord, r.uint16);

  BaseTagList = new r.Array(new r.String(4), r.uint16);

  Axis = new r.Struct({
    baseTagList: new r.Pointer(r.uint16, BaseTagList),
    baseScriptList: new r.Pointer(r.uint16, BaseScriptList)
  });

  module.exports = new r.Struct({
    version: r.uint32,
    horizAxis: new r.Pointer(r.uint16, Axis),
    vertAxis: new r.Pointer(r.uint16, Axis)
  });

}).call(this);