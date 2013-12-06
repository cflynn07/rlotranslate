(function() {
  var config, _;

  config = require('./config');

  _ = require('underscore');

  module.exports = function(options, argv) {
    var command, key, value;
    if (argv['_'].length === 0) {
      command = 'generate';
    } else if (argv['_'].length > 1) {
      console.log('Error: expected 1 command, instead got ' + argv['_'].length + "\n");
      console.log(config.messages.help);
      process.exit(1);
    } else if (_.contains(config.availableCommands, argv['_'][0])) {
      command = argv['_'][0];
    } else {
      console.log(config.messages.help);
      process.exit(1);
    }
    for (key in argv) {
      value = argv[key];
      if (key === '_' || key === '$0') {
        continue;
      }
      if (_.isUndefined(options[key])) {
        console.log('Error: unrecognized option: ' + key);
        process.exit(1);
      }
      options[key] = value;
    }
    return command;
  };

}).call(this);
