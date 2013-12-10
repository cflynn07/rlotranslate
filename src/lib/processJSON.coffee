fs  = require 'fs'
csv = require 'csv'


#remove trailing empty string values of an array
transformRow = (row) ->
  clone = row.slice(0)
  len = clone.length - 1
  while len > 0
    if clone[len] == ''
      clone.splice len, 1
    else
      return clone
    len--
  return clone


#experimental...
module.exports = (root, inputFile, inputLangName, outputFile) ->

  inputJSON = require root + '/' + inputFile


  data = []
  csv()
    .from.path(root + '/' + outputFile, {delimiter: ',', escape: '"'})
    .transform (row) ->
      return transformRow row
    .on 'record', (row, index) ->
      data.push row
    .on 'end', (count) ->
      parse()


  mode = ''
  parse = () ->
    for key, value of inputJSON.language

      languageYIndex0 = 1
      languageYIndex1 = 1

      csv()
      .from.path(root + '/' + outputFile, {delimiter: ',', escape: '"'})
      .transform (row) ->
        return transformRow row
      .on 'record', (row, index) ->

        if row[0] == ''
          return

        if row[0].indexOf('(1) ') is 0
          fileName = row[1]

        if row[0].indexOf('(2) ') is 0
          resultPath = row[1]

        if row[0].indexOf('(3) ') is 0
          mode = 'language'

          foundLanguage = false

          for value, key in row
            if key is 0 or value is ''
              continue
            if value is inputLangName
              foundLanguage  = true
              languageYIndex0 = key
              break

          if !foundLanguage
            row.push inputLangName
            data[index] = row
            languageYIndex0 = row.length - 1

          return

        if row[0].indexOf('(4) ') is 0
          mode = 'keys'
          return


        switch mode
          when 'language'

            #console.log '----'
            #console.log inputJSON.language
            #console.log row[0]
            #console.log inputJSON.language[row[0]]
            #console.log languageYIndex0
            #console.log index

            row[languageYIndex0] = inputJSON.language[row[0]]
            data[index] = row

            return
          when 'keys'
            return

      .on 'end', (count) ->
        dataStr = ''
        for row in data
          dataStr += row.join ','
          dataStr += "\n"

        fs.writeFileSync 'test.csv', dataStr
