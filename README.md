RLO Translate Utility
=====================

Preface
-------
A utility to convert from specifically formatted CSV files
of maintainable translation data into angularjs .json localization
files.

Instructions
------------
`make test`  -- run tests
`make clean` -- remove build byproducts
`make build` -- build the project
`make build-watch` -- build the project and auto rebuild when *.coffee changes
`make install-local` -- install project locally as global NPM module for testing
`make publish` -- publish to NPM
 - **Modify \*.coffee files in /src/**
 - Run `make build` or `make build-watch` to see results compiled into /bin/ && /lib/ && /test/ folders

Authors
-------
 - [Casey Flynn](cflynn.us@gmail.com)
 - [Zhenya Kovalenko](zhenya.kovalenko@rakutenloyalty.com)
