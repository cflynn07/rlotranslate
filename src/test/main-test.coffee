buster   = require 'buster'
_        = require 'underscore'
execSync = require 'exec-sync'

cli      = require '../bin/cli'

buster.testCase 'It enforces proper arguments',
  '--> Single invalid command exits error': () ->

    buster.assert.same 'test', 'test'

  '--> Multiple commands fail': () ->

    buster.assert.same 'test', 'test'

  '//--> Single valid command exits success': () ->
