// Generated by CoffeeScript 1.9.3
(function() {
  var CFFDict, CFFOperand, isEqual, r;

  isEqual = require('deep-equal');

  r = require('restructure');

  CFFOperand = require('./CFFOperand');

  CFFDict = (function() {
    var decodeOperands, encodeOperands;

    function CFFDict(ops) {
      var field, j, key, len1, ref;
      this.ops = ops != null ? ops : [];
      this.fields = {};
      ref = this.ops;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        field = ref[j];
        key = Array.isArray(field[0]) ? field[0][0] << 8 | field[0][1] : field[0];
        this.fields[key] = field;
      }
    }

    decodeOperands = function(type, stream, ret, operands) {
      var i, j, len1, op, results;
      if (Array.isArray(type)) {
        results = [];
        for (i = j = 0, len1 = operands.length; j < len1; i = ++j) {
          op = operands[i];
          results.push(decodeOperands(type[i], stream, ret, [op]));
        }
        return results;
      } else if (type.decode != null) {
        return type.decode(stream, ret, operands);
      } else {
        switch (type) {
          case 'number':
          case 'offset':
          case 'sid':
            return operands[0];
          case 'boolean':
            return !!operands[0];
          default:
            return operands;
        }
      }
    };

    encodeOperands = function(type, stream, ctx, operands) {
      var i, j, len1, op, results;
      if (Array.isArray(type)) {
        results = [];
        for (i = j = 0, len1 = operands.length; j < len1; i = ++j) {
          op = operands[i];
          results.push(encodeOperands(type[i], stream, ctx, op)[0]);
        }
        return results;
      } else if (type.encode != null) {
        return type.encode(stream, operands, ctx);
      } else if (typeof operands === 'number') {
        return [operands];
      } else if (typeof operands === 'boolean') {
        return [+operands];
      } else if (Array.isArray(operands)) {
        return operands;
      } else {
        return [operands];
      }
    };

    CFFDict.prototype.decode = function(stream, parent) {
      var b, end, field, key, name, operands, ref, ret;
      end = stream.pos + parent.length;
      ret = {};
      operands = [];
      Object.defineProperties(ret, {
        parent: {
          value: parent
        },
        _startOffset: {
          value: stream.pos
        }
      });
      while (stream.pos < end) {
        b = stream.readUInt8();
        if (b <= 21) {
          if (b === 12) {
            b = (b << 8) | stream.readUInt8();
          }
          field = this.fields[b];
          if (!field) {
            throw new Error("Unknown operator " + b);
          }
          ret[field[1]] = decodeOperands(field[2], stream, ret, operands);
          operands = [];
        } else {
          operands.push(CFFOperand.decode(stream, b));
        }
      }
      ref = this.fields;
      for (key in ref) {
        field = ref[key];
        if (ret[name = field[1]] == null) {
          ret[name] = field[3];
        }
      }
      return ret;
    };

    CFFDict.prototype.size = function(dict, parent, includePointers) {
      var ctx, field, j, k, key, len, len1, op, operands, ref, val;
      if (includePointers == null) {
        includePointers = true;
      }
      ctx = {
        parent: parent,
        val: dict,
        pointerSize: 0,
        startOffset: parent.startOffset || 0
      };
      len = 0;
      ref = this.fields;
      for (k in ref) {
        field = ref[k];
        val = dict[field[1]];
        if ((val == null) || isEqual(val, field[3])) {
          continue;
        }
        operands = encodeOperands(field[2], null, ctx, val);
        for (j = 0, len1 = operands.length; j < len1; j++) {
          op = operands[j];
          len += CFFOperand.size(op);
        }
        key = Array.isArray(field[0]) ? field[0] : [field[0]];
        len += key.length;
      }
      if (includePointers) {
        len += ctx.pointerSize;
      }
      return len;
    };

    CFFDict.prototype.encode = function(stream, dict, parent) {
      var ctx, field, i, j, key, l, len1, len2, len3, m, op, operands, ptr, ref, val;
      ctx = {
        pointers: [],
        startOffset: stream.pos,
        parent: parent,
        val: dict,
        pointerSize: 0
      };
      ctx.pointerOffset = stream.pos + this.size(dict, ctx, false);
      ref = this.ops;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        field = ref[j];
        val = dict[field[1]];
        if ((val == null) || isEqual(val, field[3])) {
          continue;
        }
        operands = encodeOperands(field[2], stream, ctx, val);
        for (l = 0, len2 = operands.length; l < len2; l++) {
          op = operands[l];
          CFFOperand.encode(stream, op);
        }
        key = Array.isArray(field[0]) ? field[0] : [field[0]];
        for (m = 0, len3 = key.length; m < len3; m++) {
          op = key[m];
          stream.writeUInt8(op);
        }
      }
      i = 0;
      while (i < ctx.pointers.length) {
        ptr = ctx.pointers[i++];
        ptr.type.encode(stream, ptr.val, ptr.parent);
      }
    };

    return CFFDict;

  })();

  module.exports = CFFDict;

}).call(this);
