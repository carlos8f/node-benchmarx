test:
	@./node_modules/.bin/mocha \
		--reporter spec \
		--bail \
		--slow 20s \
		--require test/common.js \
		--timeout 30s \
		test/defaults.js

bench:
	@./bin/benchmarx.js \
	  --title "benchmarx test" \
	  --concurrency 5 \
	  --time 2 \
	  --wait 1 \
	  --path /README.md \
	  --opts examples/conf.json \
	  examples/*.js

.PHONY: test
