test:
	@./node_modules/.bin/mocha \
		--reporter spec \
		--bail \
		--slow 20s \
		--require test/common.js \
		--timeout 30s \
		test/slam.js

.PHONY: test
