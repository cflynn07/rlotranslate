
(function() {
  var csv, fs, _;

  csv = require('csv');

  fs = require('fs');

  _ = require('underscore');

  module.exports = function(path, file) {
    var fileName, languageObjects, languageObjectsIndexes, mode, resultPath, clientObjects, clientObjectsIndexes, clientSupportedLanguages;
    fileName = '';
    resultPath = '';
    languageObjects = {};
    languageObjectsIndexes = {};
    clientObjects = {};
    clientObjectsIndexes = {};
    clientSupportedLanguages = {};
    mode = '';

    return csv().from.path(path + '/' + file, {
      delimiter: ',',
      escape: '"'
    }).transform(function(row) {
      return row;
    }).on('record', function(row, index) {
      var i, langCodeIndex, propLanguageCode, specialKeyRowParts, tmp, valLanguageCode, _i, _len, _results, _results1, _results2, clientIx;
      if (row[0] === '') {
        return;
      }
      if (row[0].indexOf('(1) ') === 0) {
        fileName = row[1];
      }
      if (row[0].indexOf('(2) ') === 0) {
        resultPath = row[1];
      }

      if (row[0].indexOf('(2a) ') === 0) {
        mode = 'clients';
        for (i =  1; i < row.length && row[i] !== ""; i++){
          clientObjects[row[i]] = {}; //create client objects
          clientObjectsIndexes[row[i]] = i;
        }
        return;
      }

      if (row[0].indexOf('(3) ') === 0) {
        mode = 'language';
        for (i = _i = 0, _len = row.length; _i < _len; i = ++_i) {
          valLanguageCode = row[i];
          if (i === 0 || valLanguageCode === '') {
            continue;
          }
          languageObjects[valLanguageCode] = {
            language: {},
            lexicon: {
              language: valLanguageCode,
              country: null,
              entries: []
            }
          };
          languageObjectsIndexes[valLanguageCode] = i - 1;
        }
        return;
      }
      if (row[0].indexOf('(4) ') === 0) {
        mode = 'keys';
        return;
      }
      if (row[0].indexOf('(5) ') === 0) {
        mode = 'specialkeys';
        return;
      }
      switch (mode) {
        case 'clients':
          for (clientIx in clientObjects){
            i = clientObjectsIndexes[clientIx];
            clientSupportedLanguages[clientIx] = row[i].split(',');
          }
          break;

        case 'language':
          _results = [];
          for (propLanguageCode in languageObjectsIndexes) {
            i = languageObjectsIndexes[propLanguageCode];
            _results.push(languageObjects[propLanguageCode]['language'][row[0]] = row[i + 1]);
          }
          return _results;
          break;
        case 'keys':
          _results1 = [];
          var prevClientIx = "";

          for (var clientObjIx in clientObjects){
            console.log('for client: ' + clientObjIx);
            clientIx = clientObjectsIndexes[clientObjIx];
            var supLangs = clientSupportedLanguages[clientObjIx];
            var prevClientSupLen = (prevClientIx==="")?0:clientSupportedLanguages[prevClientIx].length;
            i = 0;

            for (var langIx in supLangs) {
              console.log('for language: ' + supLangs[langIx]);
              if (_.isUndefined(clientObjects[clientObjIx][supLangs[langIx]])) clientObjects[clientObjIx][supLangs[langIx]] = languageObjects[supLangs[langIx]];
              tmp = {};
              tmp['key'] = row[0];
              tmp['lexicalClass'] = row[1];
              tmp['description'] = row[2];
              tmp['additionalProperties'] = row[3];
              tmp['translation'] = row[4 + (clientIx-1)*prevClientSupLen + i];
              _results1.push(clientObjects[clientObjIx][supLangs[langIx]]['lexicon']['entries'].push(tmp));
              i ++;
            }
            prevClientIx = clientObjIx;
          }

          return _results1;
          break;

        case 'specialkeys':
          specialKeyRowParts = row[0].split('_');
          _results2 = [];
          for (propLanguageCode in languageObjectsIndexes) {
            langCodeIndex = languageObjectsIndexes[propLanguageCode];
            if (_.isUndefined(languageObjects[propLanguageCode][specialKeyRowParts[0]])) {
              languageObjects[propLanguageCode][specialKeyRowParts[0]] = {};
              _results2.push(languageObjects[propLanguageCode][specialKeyRowParts[0]][specialKeyRowParts[1]] = row[langCodeIndex + 1]);
            } else {
              if (_.isUndefined(languageObjects[propLanguageCode][specialKeyRowParts[0]][specialKeyRowParts[1]])) {
                _results2.push(languageObjects[propLanguageCode][specialKeyRowParts[0]][specialKeyRowParts[1]] = row[langCodeIndex + 1]);
              } else if (_.isString(languageObjects[propLanguageCode][specialKeyRowParts[0]][specialKeyRowParts[1]])) {
                _results2.push(languageObjects[propLanguageCode][specialKeyRowParts[0]][specialKeyRowParts[1]] = [languageObjects[propLanguageCode][specialKeyRowParts[0]][specialKeyRowParts[1]], row[langCodeIndex + 1]]);
              } else if (_.isArray(languageObjects[propLanguageCode][specialKeyRowParts[0]][specialKeyRowParts[1]])) {
                _results2.push(languageObjects[propLanguageCode][specialKeyRowParts[0]][specialKeyRowParts[1]].push(row[langCodeIndex + 1]));
              } else {
                _results2.push(void 0);
              }
            }
          }
          return _results2;
      }
    }).on('end', function(count) {
      var newFile, property, value, _results;
      _results = [];

      for (var clientObjIx in clientObjects){
        var supLangs = clientSupportedLanguages[clientObjIx];

        for (var langIx in supLangs) {
          value = clientObjects[clientObjIx][supLangs[langIx]];
          var clientResultPath = resultPath + '/' + clientObjIx + '/i18n/';
          newFile = clientResultPath + fileName.replace('$', supLangs[langIx]);
          console.log(file + ' --> ' + newFile + "\n");
         fs.writeFileSync(newFile, JSON.stringify(value, null, 2));
        }
      }

      return _results;
    }).on('error', function(error) {
      console.log('error');
      return console.log(error);
    });
  };

}).call(this);
