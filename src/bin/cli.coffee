process.bin = process.title = 'rlotranslate'

fs            = require 'fs'
_             = require 'underscore'
argv          = require('optimist').argv
clearTerminal = require '../lib/clearTerminal'
validateUsage = require '../lib/validateUsage'
processCSV    = require '../lib/processCSV'
processJSON   = require '../lib/processJSON'
config        = require '../lib/config'
execSync      = require 'exec-sync'
pwd           = execSync 'pwd'

#clearTerminal()

#create a copy of original options
options = _.extend {}, config.optionDefaults

#Will exit if improper usage, mutates options
command = validateUsage options, argv

if options.h
  console.log config.messages.help
  process.exit 0

if options.v
  console.log require('../package').version
  process.exit 0

switch command
  when 'generate', 'list'
    path = pwd + '/' + options.d

    if !fs.existsSync path
      console.log 'Error: directory does not exist: ' + path + "\n"
      process.exit 1

    dirContents = fs.readdirSync path
    dirContents = _.filter dirContents, (item) ->
      stats = fs.statSync(path + '/' + item)
      return (item.indexOf('.csv') == (item.length - 4)) && stats.isFile()

    if !dirContents.length
      console.log 'Error: directory empty. No translation files found.' + "\n"
      process.exit 1

    console.log 'Found ' + dirContents.length + ' translation files...' + "\n"

    for val in dirContents
      processCSV path, val, command, options


  when 'reverse'
    console.log 'reverse is currently ready'
    process.exit 0

    if !options.input || !options.output || !options.inputLangName
      console.log 'Error: options -input and -output and -inputLangName required' + "\n"
      process.exit 1

    processJSON pwd, options.input, options.inputLangName, options.output












