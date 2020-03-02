# Makefile

install:
	npm install

publish:
	npm publish --dry-run

build:
	rm -rf dist
	npm run build

lint:
	npx eslint .

babel:
	npx babel src --out-dir dist

link:
	npm link

test:
	npx jest

.PHONY: test
