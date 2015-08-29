// Generated by CoffeeScript 1.9.3
(function() {
  var ArabicShaper, DefaultShaper, UnicodeTrie, fs, trie, unicode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  DefaultShaper = require('./DefaultShaper');

  unicode = require('unicode-properties');

  UnicodeTrie = require('unicode-trie');

  fs = require('fs');

  trie = new UnicodeTrie(fs.readFileSync(__dirname + '/data.trie'));

  ArabicShaper = (function(superClass) {
    var FIN2, FIN3, FINA, INIT, ISOL, MED2, MEDI, NONE, STATE_TABLE, ShapingClasses, getShapingClass;

    extend(ArabicShaper, superClass);

    function ArabicShaper() {
      return ArabicShaper.__super__.constructor.apply(this, arguments);
    }

    ArabicShaper.getGlobalFeatures = function(script, isVertical) {
      var features;
      if (isVertical == null) {
        isVertical = false;
      }
      features = ArabicShaper.__super__.constructor.getGlobalFeatures.apply(this, arguments);
      features.push('mset');
      return features;
    };

    ShapingClasses = {
      Non_Joining: 0,
      Left_Joining: 1,
      Right_Joining: 2,
      Dual_Joining: 3,
      Join_Causing: 3,
      ALAPH: 4,
      'DALATH RISH': 5,
      Transparent: 6
    };

    ISOL = 'isol';

    FINA = 'fina';

    FIN2 = 'fin2';

    FIN3 = 'fin3';

    MEDI = 'medi';

    MED2 = 'med2';

    INIT = 'init';

    NONE = null;

    STATE_TABLE = [[[NONE, NONE, 0], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 6]], [[NONE, NONE, 0], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 2], [NONE, FIN2, 5], [NONE, ISOL, 6]], [[NONE, NONE, 0], [NONE, ISOL, 2], [INIT, FINA, 1], [INIT, FINA, 3], [INIT, FINA, 4], [INIT, FINA, 6]], [[NONE, NONE, 0], [NONE, ISOL, 2], [MEDI, FINA, 1], [MEDI, FINA, 3], [MEDI, FINA, 4], [MEDI, FINA, 6]], [[NONE, NONE, 0], [NONE, ISOL, 2], [MED2, ISOL, 1], [MED2, ISOL, 2], [MED2, FIN2, 5], [MED2, ISOL, 6]], [[NONE, NONE, 0], [NONE, ISOL, 2], [ISOL, ISOL, 1], [ISOL, ISOL, 2], [ISOL, FIN2, 5], [ISOL, ISOL, 6]], [[NONE, NONE, 0], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 2], [NONE, FIN3, 5], [NONE, ISOL, 6]]];

    getShapingClass = function(codePoint) {
      var ref, res;
      res = trie.get(codePoint);
      if (res) {
        return res - 1;
      }
      if ((ref = unicode.getCategory(codePoint)) === 'Mn' || ref === 'Me' || ref === 'Cf') {
        return ShapingClasses.Transparent;
      }
      return ShapingClasses.Non_Joining;
    };

    ArabicShaper.assignFeatures = function(glyphs, script) {
      var actions, curAction, feature, features, glyph, i, index, j, k, len, len1, prev, prevAction, ref, state, type;
      features = ArabicShaper.__super__.constructor.assignFeatures.apply(this, arguments);
      prev = -1;
      state = 0;
      actions = [];
      for (i = j = 0, len = glyphs.length; j < len; i = ++j) {
        glyph = glyphs[i];
        type = getShapingClass(glyph.codePoints[0]);
        if (type === ShapingClasses.Transparent) {
          actions[i] = NONE;
          continue;
        }
        ref = STATE_TABLE[state][type], prevAction = ref[0], curAction = ref[1], state = ref[2];
        if (prevAction !== NONE && prev !== -1) {
          actions[prev] = prevAction;
        }
        actions[i] = curAction;
        prev = i;
      }
      for (index = k = 0, len1 = glyphs.length; k < len1; index = ++k) {
        glyph = glyphs[index];
        if (feature = actions[index]) {
          glyph.features[feature] = true;
        }
      }
      features.push('isol', 'fina', 'fin2', 'fin3', 'medi', 'med2', 'init');
      return features;
    };

    return ArabicShaper;

  })(DefaultShaper);

  module.exports = ArabicShaper;

}).call(this);