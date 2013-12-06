(function() {
  var csv, fs, transformRow;

  fs = require('fs');

  csv = require('csv');

  transformRow = function(row) {
    var clone, len;
    clone = row.slice(0);
    len = clone.length - 1;
    while (len > 0) {
      if (clone[len] === '') {
        clone.splice(len, 1);
      } else {
        return clone;
      }
      len--;
    }
    return clone;
  };

  module.exports = function(root, inputFile, inputLangName, outputFile) {
    var data, inputJSON, mode, parse;
    inputJSON = require(root + '/' + inputFile);
    data = [];
    csv().from.path(root + '/' + outputFile, {
      delimiter: ',',
      escape: '"'
    }).transform(function(row) {
      return transformRow(row);
    }).on('record', function(row, index) {
      return data.push(row);
    }).on('end', function(count) {
      return parse();
    });
    mode = '';
    return parse = function() {
      var key, languageYIndex0, languageYIndex1, value, _ref, _results;
      _ref = inputJSON.language;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        languageYIndex0 = 1;
        languageYIndex1 = 1;
        _results.push(csv().from.path(root + '/' + outputFile, {
          delimiter: ',',
          escape: '"'
        }).transform(function(row) {
          return transformRow(row);
        }).on('record', function(row, index) {
          var fileName, foundLanguage, resultPath, _i, _len;
          if (row[0] === '') {
            return;
          }
          if (row[0].indexOf('(1) ') === 0) {
            fileName = row[1];
          }
          if (row[0].indexOf('(2) ') === 0) {
            resultPath = row[1];
          }
          if (row[0].indexOf('(3) ') === 0) {
            mode = 'language';
            foundLanguage = false;
            for (key = _i = 0, _len = row.length; _i < _len; key = ++_i) {
              value = row[key];
              if (key === 0 || value === '') {
                continue;
              }
              if (value === inputLangName) {
                foundLanguage = true;
                languageYIndex0 = key;
                break;
              }
            }
            if (!foundLanguage) {
              row.push(inputLangName);
              data[index] = row;
              languageYIndex0 = row.length - 1;
            }
            return;
          }
          if (row[0].indexOf('(4) ') === 0) {
            mode = 'keys';
            return;
          }
          switch (mode) {
            case 'language':
              row[languageYIndex0] = inputJSON.language[row[0]];
              data[index] = row;
              break;
            case 'keys':
          }
        }).on('end', function(count) {
          var dataStr, row, _i, _len;
          dataStr = '';
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            row = data[_i];
            dataStr += row.join(',');
            dataStr += "\n";
          }
          return fs.writeFileSync('test.csv', dataStr);
        }));
      }
      return _results;
    };
  };

}).call(this);
