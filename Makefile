# Makefile

install:
	npm install

publish:
	npm publish --dry-run

lint:
	npx eslint .

babel:
	npx babel src --out-dir dist

.PHONY: test
