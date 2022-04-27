cmd := "version"
opt := ""
DOCKER_COMPOSE := docker compose
GH_USER_ID := peaceiris
HUGO_VERSION := $(shell cd ./deps && go mod edit -json | jq -r '.Require[] | select(.Path == "github.com/gohugoio/hugo") | .Version | split("v") | .[1]')
GO_VERSION := $(shell cd ./deps && go mod edit -json | jq -r '.Go')

.PHONY: bump-node
bump-node:
	bash scripts/bump_node.sh

.PHONY: npm-ci
npm-ci:
	cd ./exampleSite && \
	npm ci

.PHONY: docker-dev
docker-dev:
	$(eval opt := --bind=0.0.0.0)
	export HUGO_VERSION=${HUGO_VERSION} && \
	$(DOCKER_COMPOSE) up -d && \
	$(DOCKER_COMPOSE) exec hugo make dev opt=$(opt) || \
	$(DOCKER_COMPOSE) down

.PHONY: docker-hugo
docker-hugo:
	@echo 'usage: make docker-hugo cmd="version"'
	export HUGO_VERSION=${HUGO_VERSION} && \
	$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(cmd)

.PHONY: docker-build
docker-build:
	export HUGO_VERSION=${HUGO_VERSION} && \
	$(DOCKER_COMPOSE) run --rm --entrypoint=make hugo build-prod

.PHONY: docker-test
docker-test:
	export HUGO_VERSION=${HUGO_VERSION} && \
	$(DOCKER_COMPOSE) run --rm --entrypoint=make hugo test

.PHONY: dev
dev:
	cd ./exampleSite && \
	hugo server --renderStaticToDisk --navigateToChanged --buildDrafts $(opt)

.PHONY: test
test:
	cd ./exampleSite && \
	hugo --minify --debug --renderToMemory \
		--templateMetrics --templateMetricsHints \
		--printPathWarnings --printUnusedTemplates

.PHONY: build-staging
build-staging:
	cd ./exampleSite && \
	hugo --minify --debug --cleanDestinationDir \
		--environment "staging" \
		--templateMetrics --templateMetricsHints \
		--printPathWarnings --printUnusedTemplates

.PHONY: build-prod
build-prod:
	cd ./exampleSite && \
	hugo --minify --cleanDestinationDir --printPathWarnings && \
	wget -O ./public/report.html ${BASE_URL}/report.html || true

.PHONY: fetch-data
fetch-data:
	cd ./exampleSite && \
	bash ./scripts/fetch_data.sh ${GH_USER_ID} > ./data/github/${GH_USER_ID}.json && \
	deno run --allow-net --allow-read --allow-write --unstable scripts/fetch_images.ts

.PHONY: get-go-version
get-go-version:
	@echo ${GO_VERSION}

.PHONY: get-hugo-version
get-hugo-version:
	@echo ${HUGO_VERSION}
