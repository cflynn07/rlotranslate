PATH := ./node_modules/.bin:${PATH}

.PHONY : init clean-docs clean build test dist publish

init:
	npm install

docs:
	docco src/*.coffee

clean-docs:
	rm -rf docs/

clean:
	mv bin/wrapper.js bin/wrapper.tmp
	find ./bin/  -name '*.js' -type f | xargs rm -f
	mv bin/wrapper.tmp bin/wrapper.js
	find ./lib/  -name '*.js' -type f | xargs rm -f
	find ./test/ -name '*.js' -type f | xargs rm -f
	rm -rf ./test/data

build:
	cp -R ./src/test/data ./test/data
	coffee -o ./ -c src/

build-watch: build
	coffee -w -o ./ -c src/

dist: clean init build test

test:
	echo "TODO: TESTS"

publish: dist
	npm publish
