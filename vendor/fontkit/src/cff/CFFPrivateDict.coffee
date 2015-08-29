CFFDict = require './CFFDict'
CFFIndex = require './CFFIndex'
CFFPointer = require './CFFPointer'

module.exports = new CFFDict [
    # key       name                    type                                         default
    [6,         'BlueValues',           'delta',                                     null]
    [7,         'OtherBlues',           'delta',                                     null]
    [8,         'FamilyBlues',          'delta',                                     null]
    [9,         'FamilyOtherBlues',     'delta',                                     null]
    [[12, 9],   'BlueScale',            'number',                                    0.039625]
    [[12, 10],  'BlueShift',            'number',                                    7]
    [[12, 11],  'BlueFuzz',             'number',                                    1]
    [10,        'StdHW',                'number',                                    null]
    [11,        'StdVW',                'number',                                    null]
    [[12, 12],  'StemSnapH',            'delta',                                     null]
    [[12, 13],  'StemSnapV',            'delta',                                     null]
    [[12, 14],  'ForceBold',            'boolean',                                   false]
    [[12, 17],  'LanguageGroup',        'number',                                    0]
    [[12, 18],  'ExpansionFactor',      'number',                                    0.06]
    [[12, 19],  'initialRandomSeed',    'number',                                    0]
    [20,        'defaultWidthX',        'number',                                    0]
    [21,        'nominalWidthX',        'number',                                    0]
    [19,        'Subrs',                new CFFPointer(new CFFIndex, type: 'local'), null]
]