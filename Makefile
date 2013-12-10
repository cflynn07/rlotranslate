PATH := ./node_modules/.bin:${PATH}

.PHONY : init clean-docs clean build test dist publish

init:
	npm install

docs:
	docco src/*.coffee

clean-docs:
	rm -rf docs/

clean:
	rm -rf node_modules/
	mv build/bin/wrapper.js build/bin/wrapper.tmp
	find .build/bin/  -name '*.js' -type f | xargs rm -f
	mv ./build/bin/wrapper.tmp ./build/bin/wrapper.js
	find .build/lib/  -name '*.js' -type f | xargs rm -f
	find .build/test/ -name '*.js' -type f | xargs rm -f
	rm -rf ./build/test/data

build:
	test -d ./node_modules || npm install
	cp -R ./src/test/data ./build/test/data
	coffee -o ./build/ -c src/

build-watch:
	test -d ./node_modules || npm install
	cp -R ./src/test/data ./build/test/data
	coffee -w -o ./build/ -c src/

dist: clean init build test

test:
	echo "TODO: TESTS"

publish-local:
	make build
	npm install . -g
publish: dist
	npm publish
