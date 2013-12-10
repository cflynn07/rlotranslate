PATH := ./node_modules/.bin:${PATH}

.PHONY : init clean-docs clean build test dist publish

init:
	npm install

docs:
	docco src/*.coffee

clean-docs:
	rm -rf docs/

clean:
	rm -rf lib/
	rm -rf bin/

build:
	coffee -o ./ -c src/

build-watch:
  coffee -w -o ./ -c src/

dist: clean init build test

test:
	echo "TODO: TESTS"

publish: dist
	npm publish
