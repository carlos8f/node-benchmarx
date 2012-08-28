test:
	@./node_modules/.bin/mocha \
		--reporter spec \
		--bail \
		--require test/common.js \
		--timeout 30s

.PHONY: test