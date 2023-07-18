ifneq ($(PORT),)
	exposed=-p $(subst $(shell echo ','), -p ,$(PORT))
endif

ifneq ($(wildcard .env),)
include .env
endif

CURRENT_DIRECTORY=$(shell pwd)

BASE_COMPOSE=-f $(CURRENT_DIRECTORY)/docker-compose.yml
DEV_COMPOSE= $(BASE_COMPOSE) -f $(CURRENT_DIRECTORY)/docker-compose.dev.yml

.EXPORT_ALL_VARIABLES:

# environment
NODE_ENV ?= development

user\:%:
	@make -sC services/user/src $(subst :, ,$(subst user:,,$@))

bash: ## SSH into service container
	@docker exec -it vescape-ecommerce_$(service)_1 /bin/bash

ci: ## Run scripts as if we're in CI! :wink:
	@$(CURRENT_DIRECTORY)/scripts/ci/docker-login.sh
	@$(CURRENT_DIRECTORY)/scripts/ci/get-backend.sh
	@$(CURRENT_DIRECTORY)/scripts/ci/get-images.sh
	@$(CURRENT_DIRECTORY)/scripts/ci/run-tests.sh

dev: ## Up and bash into service
	@make -s dev-up bash

dev-up: ## Lift dev environment or single service
	@echo "Please wait while the $(service) service is provisioned..."
	@docker-compose $(DEV_COMPOSE) -f $(CURRENT_DIRECTORY)/services/$(service)/docker-compose.dev.yml up --no-recreate -d $(service)

dev-down: ## Destroy dev environment
	@docker-compose $(DEV_COMPOSE) down

lint: ## Run linters through all code
	@$(CURRENT_DIRECTORY)/scripts/ci/run-linters.sh
