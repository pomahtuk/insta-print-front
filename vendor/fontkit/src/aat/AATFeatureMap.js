// Generated by CoffeeScript 1.9.3
(function() {
  var AATFeatureMap;

  AATFeatureMap = (function() {
    var AATMapping, OTMapping, aat, feature, features, i, j, mapFeatureStrings, name1, ot;

    function AATFeatureMap() {}

    features = {
      allTypographicFeatures: {
        code: 0,
        exclusive: false,
        allTypeFeatures: 0
      },
      ligatures: {
        code: 1,
        exclusive: false,
        requiredLigatures: 0,
        commonLigatures: 2,
        rareLigatures: 4,
        rebusPictures: 8,
        diphthongLigatures: 10,
        squaredLigatures: 12,
        abbrevSquaredLigatures: 14,
        symbolLigatures: 16,
        contextualLigatures: 18,
        historicalLigatures: 20
      },
      cursiveConnection: {
        code: 2,
        exclusive: true,
        unconnected: 0,
        partiallyConnected: 1,
        cursive: 2
      },
      letterCase: {
        code: 3,
        exclusive: true
      },
      verticalSubstitution: {
        code: 4,
        exclusive: false,
        substituteVerticalForms: 0
      },
      linguisticRearrangement: {
        code: 5,
        exclusive: false,
        linguisticRearrangement: 0
      },
      numberSpacing: {
        code: 6,
        exclusive: true,
        monospacedNumbers: 0,
        proportionalNumbers: 1,
        thirdWidthNumbers: 2,
        quarterWidthNumbers: 3
      },
      smartSwash: {
        code: 8,
        exclusive: false,
        wordInitialSwashes: 0,
        wordFinalSwashes: 2,
        nonFinalSwashes: 8
      },
      diacritics: {
        code: 9,
        exclusive: true,
        showDiacritics: 0,
        hideDiacritics: 1,
        decomposeDiacritics: 2
      },
      verticalPosition: {
        code: 10,
        exclusive: true,
        normalPosition: 0,
        superiors: 1,
        inferiors: 2,
        ordinals: 3,
        scientificInferiors: 4
      },
      fractions: {
        code: 11,
        exclusive: true,
        noFractions: 0,
        verticalFractions: 1,
        diagonalFractions: 2
      },
      overlappingCharacters: {
        code: 13,
        exclusive: false,
        preventOverlap: 0
      },
      typographicExtras: {
        code: 14,
        exclusive: false,
        slashedZero: 4
      },
      mathematicalExtras: {
        code: 15,
        exclusive: false,
        mathematicalGreek: 10
      },
      ornamentSets: {
        code: 16,
        exclusive: true,
        noOrnaments: 0,
        dingbats: 1,
        piCharacters: 2,
        fleurons: 3,
        decorativeBorders: 4,
        internationalSymbols: 5,
        mathSymbols: 6
      },
      characterAlternatives: {
        code: 17,
        exclusive: true,
        noAlternates: 0
      },
      designComplexity: {
        code: 18,
        exclusive: true,
        designLevel1: 0,
        designLevel2: 1,
        designLevel3: 2,
        designLevel4: 3,
        designLevel5: 4
      },
      styleOptions: {
        code: 19,
        exclusive: true,
        noStyleOptions: 0,
        displayText: 1,
        engravedText: 2,
        illuminatedCaps: 3,
        titlingCaps: 4,
        tallCaps: 5
      },
      characterShape: {
        code: 20,
        exclusive: true,
        traditionalCharacters: 0,
        simplifiedCharacters: 1,
        JIS1978Characters: 2,
        JIS1983Characters: 3,
        JIS1990Characters: 4,
        traditionalAltOne: 5,
        traditionalAltTwo: 6,
        traditionalAltThree: 7,
        traditionalAltFour: 8,
        traditionalAltFive: 9,
        expertCharacters: 10,
        JIS2004Characters: 11,
        hojoCharacters: 12,
        NLCCharacters: 13,
        traditionalNamesCharacters: 14
      },
      numberCase: {
        code: 21,
        exclusive: true,
        lowerCaseNumbers: 0,
        upperCaseNumbers: 1
      },
      textSpacing: {
        code: 22,
        exclusive: true,
        proportionalText: 0,
        monospacedText: 1,
        halfWidthText: 2,
        thirdWidthText: 3,
        quarterWidthText: 4,
        altProportionalText: 5,
        altHalfWidthText: 6
      },
      transliteration: {
        code: 23,
        exclusive: true,
        noTransliteration: 0
      },
      annotation: {
        code: 24,
        exclusive: true,
        noAnnotation: 0,
        boxAnnotation: 1,
        roundedBoxAnnotation: 2,
        circleAnnotation: 3,
        invertedCircleAnnotation: 4,
        parenthesisAnnotation: 5,
        periodAnnotation: 6,
        romanNumeralAnnotation: 7,
        diamondAnnotation: 8,
        invertedBoxAnnotation: 9,
        invertedRoundedBoxAnnotation: 10
      },
      kanaSpacing: {
        code: 25,
        exclusive: true,
        fullWidthKana: 0,
        proportionalKana: 1
      },
      ideographicSpacing: {
        code: 26,
        exclusive: true,
        fullWidthIdeographs: 0,
        proportionalIdeographs: 1,
        halfWidthIdeographs: 2
      },
      unicodeDecomposition: {
        code: 27,
        exclusive: false,
        canonicalComposition: 0,
        compatibilityComposition: 2,
        transcodingComposition: 4
      },
      rubyKana: {
        code: 28,
        exclusive: false,
        rubyKana: 2
      },
      CJKSymbolAlternatives: {
        code: 29,
        exclusive: true,
        noCJKSymbolAlternatives: 0,
        CJKSymbolAltOne: 1,
        CJKSymbolAltTwo: 2,
        CJKSymbolAltThree: 3,
        CJKSymbolAltFour: 4,
        CJKSymbolAltFive: 5
      },
      ideographicAlternatives: {
        code: 30,
        exclusive: true,
        noIdeographicAlternatives: 0,
        ideographicAltOne: 1,
        ideographicAltTwo: 2,
        ideographicAltThree: 3,
        ideographicAltFour: 4,
        ideographicAltFive: 5
      },
      CJKVerticalRomanPlacement: {
        code: 31,
        exclusive: true,
        CJKVerticalRomanCentered: 0,
        CJKVerticalRomanHBaseline: 1
      },
      italicCJKRoman: {
        code: 32,
        exclusive: false,
        CJKItalicRoman: 2
      },
      caseSensitiveLayout: {
        code: 33,
        exclusive: false,
        caseSensitiveLayout: 0,
        caseSensitiveSpacing: 2
      },
      alternateKana: {
        code: 34,
        exclusive: false,
        alternateHorizKana: 0,
        alternateVertKana: 2
      },
      stylisticAlternatives: {
        code: 35,
        exclusive: false,
        noStylisticAlternates: 0,
        stylisticAltOne: 2,
        stylisticAltTwo: 4,
        stylisticAltThree: 6,
        stylisticAltFour: 8,
        stylisticAltFive: 10,
        stylisticAltSix: 12,
        stylisticAltSeven: 14,
        stylisticAltEight: 16,
        stylisticAltNine: 18,
        stylisticAltTen: 20,
        stylisticAltEleven: 22,
        stylisticAltTwelve: 24,
        stylisticAltThirteen: 26,
        stylisticAltFourteen: 28,
        stylisticAltFifteen: 30,
        stylisticAltSixteen: 32,
        stylisticAltSeventeen: 34,
        stylisticAltEighteen: 36,
        stylisticAltNineteen: 38,
        stylisticAltTwenty: 40
      },
      contextualAlternates: {
        code: 36,
        exclusive: false,
        contextualAlternates: 0,
        swashAlternates: 2,
        contextualSwashAlternates: 4
      },
      lowerCase: {
        code: 37,
        exclusive: true,
        defaultLowerCase: 0,
        lowerCaseSmallCaps: 1,
        lowerCasePetiteCaps: 2
      },
      upperCase: {
        code: 38,
        exclusive: true,
        defaultUpperCase: 0,
        upperCaseSmallCaps: 1,
        upperCasePetiteCaps: 2
      },
      languageTag: {
        code: 39,
        exclusive: true
      },
      CJKRomanSpacing: {
        code: 103,
        exclusive: true,
        halfWidthCJKRoman: 0,
        proportionalCJKRoman: 1,
        defaultCJKRoman: 2,
        fullWidthCJKRoman: 3
      }
    };

    feature = function(name, selector) {
      return [features[name].code, features[name][selector]];
    };

    OTMapping = {
      rlig: feature('ligatures', 'requiredLigatures'),
      clig: feature('ligatures', 'contextualLigatures'),
      dlig: feature('ligatures', 'rareLigatures'),
      hlig: feature('ligatures', 'historicalLigatures'),
      liga: feature('ligatures', 'commonLigatures'),
      hist: feature('ligatures', 'historicalLigatures'),
      smcp: feature('lowerCase', 'lowerCaseSmallCaps'),
      pcap: feature('lowerCase', 'lowerCasePetiteCaps'),
      frac: feature('fractions', 'diagonalFractions'),
      dnom: feature('fractions', 'diagonalFractions'),
      numr: feature('fractions', 'diagonalFractions'),
      afrc: feature('fractions', 'verticalFractions'),
      "case": feature('caseSensitiveLayout', 'caseSensitiveLayout'),
      ccmp: feature('unicodeDecomposition', 'canonicalComposition'),
      cpct: feature('CJKVerticalRomanPlacement', 'CJKVerticalRomanCentered'),
      valt: feature('CJKVerticalRomanPlacement', 'CJKVerticalRomanCentered'),
      swsh: feature('contextualAlternates', 'swashAlternates'),
      cswh: feature('contextualAlternates', 'contextualSwashAlternates'),
      curs: feature('cursiveConnection', 'cursive'),
      c2pc: feature('upperCase', 'upperCasePetiteCaps'),
      c2sc: feature('upperCase', 'upperCaseSmallCaps'),
      init: feature('smartSwash', 'wordInitialSwashes'),
      fin2: feature('smartSwash', 'wordFinalSwashes'),
      medi: feature('smartSwash', 'nonFinalSwashes'),
      med2: feature('smartSwash', 'nonFinalSwashes'),
      fin3: feature('smartSwash', 'wordFinalSwashes'),
      fina: feature('smartSwash', 'wordFinalSwashes'),
      fwid: feature('kanaSpacing', 'fullWidthKana'),
      pkna: feature('kanaSpacing', 'proportionalKana'),
      half: feature('textSpacing', 'halfWidthText'),
      halt: feature('textSpacing', 'altHalfWidthText'),
      hwid: feature('textSpacing', 'halfWidthText'),
      hkna: feature('alternateKana', 'alternateHorizKana'),
      vkna: feature('alternateKana', 'alternateVertKana'),
      ital: feature('italicCJKRoman', 'CJKItalicRoman'),
      lnum: feature('numberCase', 'upperCaseNumbers'),
      onum: feature('numberCase', 'lowerCaseNumbers'),
      mgrk: feature('mathematicalExtras', 'mathematicalGreek'),
      calt: feature('contextualAlternates', 'contextualAlternates'),
      vrt2: feature('verticalSubstitution', 'substituteVerticalForms'),
      vert: feature('verticalSubstitution', 'substituteVerticalForms'),
      tnum: feature('numberSpacing', 'monospacedNumbers'),
      pnum: feature('numberSpacing', 'proportionalNumbers'),
      sups: feature('verticalPosition', 'superiors'),
      subs: feature('verticalPosition', 'inferiors'),
      ordn: feature('verticalPosition', 'ordinals'),
      pwid: feature('textSpacing', 'proportionalText'),
      hwid: feature('textSpacing', 'halfWidthText'),
      qwid: feature('textSpacing', 'quarterWidthText'),
      twid: feature('textSpacing', 'thirdWidthText'),
      fwid: feature('textSpacing', 'proportionalText'),
      palt: feature('textSpacing', 'altProportionalText'),
      trad: feature('characterShape', 'traditionalCharacters'),
      smpl: feature('characterShape', 'simplifiedCharacters'),
      jp78: feature('characterShape', 'JIS1978Characters'),
      jp83: feature('characterShape', 'JIS1983Characters'),
      jp90: feature('characterShape', 'JIS1990Characters'),
      jp04: feature('characterShape', 'JIS2004Characters'),
      expt: feature('characterShape', 'expertCharacters'),
      hojo: feature('characterShape', 'hojoCharacters'),
      nlck: feature('characterShape', 'NLCCharacters'),
      tnam: feature('characterShape', 'traditionalNamesCharacters'),
      ruby: feature('rubyKana', 'rubyKana'),
      titl: feature('styleOptions', 'titlingCaps'),
      zero: feature('typographicExtras', 'slashedZero'),
      ss01: feature('stylisticAlternatives', 'stylisticAltOne'),
      ss02: feature('stylisticAlternatives', 'stylisticAltTwo'),
      ss03: feature('stylisticAlternatives', 'stylisticAltThree'),
      ss04: feature('stylisticAlternatives', 'stylisticAltFour'),
      ss05: feature('stylisticAlternatives', 'stylisticAltFive'),
      ss06: feature('stylisticAlternatives', 'stylisticAltSix'),
      ss07: feature('stylisticAlternatives', 'stylisticAltSeven'),
      ss08: feature('stylisticAlternatives', 'stylisticAltEight'),
      ss09: feature('stylisticAlternatives', 'stylisticAltNine'),
      ss10: feature('stylisticAlternatives', 'stylisticAltTen'),
      ss11: feature('stylisticAlternatives', 'stylisticAltEleven'),
      ss12: feature('stylisticAlternatives', 'stylisticAltTwelve'),
      ss13: feature('stylisticAlternatives', 'stylisticAltThirteen'),
      ss14: feature('stylisticAlternatives', 'stylisticAltFourteen'),
      ss15: feature('stylisticAlternatives', 'stylisticAltFifteen'),
      ss16: feature('stylisticAlternatives', 'stylisticAltSixteen'),
      ss17: feature('stylisticAlternatives', 'stylisticAltSeventeen'),
      ss18: feature('stylisticAlternatives', 'stylisticAltEighteen'),
      ss19: feature('stylisticAlternatives', 'stylisticAltNineteen'),
      ss20: feature('stylisticAlternatives', 'stylisticAltTwenty')
    };

    for (i = j = 1; j <= 99; i = ++j) {
      OTMapping['cv' + ('00' + i).slice(-2)] = [features.characterAlternatives.code, i];
    }

    AATMapping = {};

    for (ot in OTMapping) {
      aat = OTMapping[ot];
      if (AATMapping[name1 = aat[0]] == null) {
        AATMapping[name1] = {};
      }
      AATMapping[aat[0]][aat[1]] = ot;
    }

    AATFeatureMap.mapOTToAAT = function(features) {
      var k, len, name2, r, res;
      res = {};
      for (k = 0, len = features.length; k < len; k++) {
        feature = features[k];
        if (r = OTMapping[feature]) {
          if (res[name2 = r[0]] == null) {
            res[name2] = {};
          }
          res[r[0]][r[1]] = true;
        }
      }
      return res;
    };

    mapFeatureStrings = function(f) {
      var ref, ref1, setting, settingCode, type, typeCode;
      type = f[0], setting = f[1];
      if (isNaN(type)) {
        typeCode = (ref = features[type]) != null ? ref.code : void 0;
      } else {
        typeCode = type;
      }
      if (isNaN(setting)) {
        settingCode = (ref1 = features[type]) != null ? ref1[setting] : void 0;
      } else {
        settingCode = setting;
      }
      return [typeCode, settingCode];
    };

    AATFeatureMap.mapAATToOT = function(features) {
      var f, k, len, r, ref, ref1, res, setting, type, v;
      res = {};
      if (Array.isArray(features)) {
        for (k = 0, len = features.length; k < len; k++) {
          feature = features[k];
          f = mapFeatureStrings(feature);
          if (r = (ref = AATMapping[f[0]]) != null ? ref[f[1]] : void 0) {
            res[r] = true;
          }
        }
      } else if (typeof features === 'object') {
        for (type in features) {
          feature = features[type];
          for (setting in feature) {
            v = feature[setting];
            f = mapFeatureStrings([type, setting]);
            if (v && (r = (ref1 = AATMapping[f[0]]) != null ? ref1[f[1]] : void 0)) {
              res[r] = true;
            }
          }
        }
      }
      return Object.keys(res);
    };

    return AATFeatureMap;

  })();

  module.exports = AATFeatureMap;

}).call(this);
