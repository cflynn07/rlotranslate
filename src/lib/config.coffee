format = 'Format: rlotranslate [generate/reverse/list] [options]' + "\n"

config =
  availableCommands: [
    'generate'
    'reverse'
    'list'
  ]
  optionDefaults:
    d:             'i18n_masters'
    h:             false
    v:             false
    o:             false

    #selected output locales
    l:             false

    input:         false
    output:        false
    inputLangName: false

  messages:
#   badUsageaFormat: format
    help: format + "\n
      [options]\n
      -h    help\n
      -v    version\n
      -d    directory of i18n_master files\n
            (default == ./i18n_masters )\n
      -o    output directory of generated files\n
            (default == ./path-specified-in-csv-file)\n
      -l    specify which locales to generate files for\n
            (separate by commas, ex: fr,de,ja,en)"


module.exports = config