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

bash: ## SSH into service container
	@docker exec -it vescape-ecommerce_$(service)_1 /bin/bash

dev: ## Up and bash into service
	@make -s dev-up bash

dev-up: ## Lift dev environment or single service
	@echo "Please wait while the $(service) service is provisioned..."
	@docker-compose $(DEV_COMPOSE) -f $(CURRENT_DIRECTORY)/services/$(service)/docker-compose.dev.yml up --no-recreate -d $(service)

dev-down: ## Destroy dev environment
	@docker-compose $(DEV_COMPOSE) down
