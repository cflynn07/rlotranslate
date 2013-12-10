config = module.exports

config['Tests'] =
  environment: 'node'
  rootPath: '../'
  sources: []
  tests: [
    'spec/*-test.js'
  ]