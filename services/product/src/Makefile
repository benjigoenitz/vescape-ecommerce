# default settings
report := html

# environment
NODE_ENV ?= development

help: Makefile
	@awk -F':.*?##' '/[a-z]+:.*##/{printf "\033[36m%-13s\033[0m %s\n",$$1,$$2}' $<

dev: deps ## Run in dev mode
	@npm run dev

reset: deps ## Reset databse and populate with dev seeds data
	@node ./dev_seeds

migrate: deps ## Execute migrations
	@npm run db:migrate

test-unit: deps ## Run unit tests and report coverage results
	@npm run test:unit

cov: deps ## Report coverage after tests
	@npm run test:report -- -r $(report)

.PHONY: help dev reset migrate test-unit cov

deps: ## Reinstall dependencies if needed
	@(((ls ./node_modules | grep .) > /dev/null 2>&1) || npm i) || true