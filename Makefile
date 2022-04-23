include .env

pwd := $(CURDIR)
cmd := ""
DOCKER_COMPOSE := docker-compose
GH_USER_ID := peaceiris


.PHONY: up
up:
	export HUGO_VERSION=$(shell make get-hugo-version) && \
		$(DOCKER_COMPOSE) up -d && \
		$(DOCKER_COMPOSE) exec hugo hugo \
			server --navigateToChanged --bind=0.0.0.0 --buildDrafts

.PHONY: npm-up
npm-up:
	cd ./exampleSite && \
		hugo server --navigateToChanged --buildDrafts

.PHONY: hugo
hugo:
	# make hugo cmd="version"
	export HUGO_VERSION=$(shell make get-hugo-version) && \
		$(DOCKER_COMPOSE) run --rm --entrypoint=npm hugo ci && \
		$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(cmd)

.PHONY: build
build:
	$(eval opt := --minify --cleanDestinationDir)
	export HUGO_VERSION=$(shell make get-hugo-version) && \
		$(DOCKER_COMPOSE) run --rm --entrypoint=npm hugo ci && \
		$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(opt)

.PHONY: npm-build
npm-build:
	cd ./exampleSite && \
		hugo --minify --cleanDestinationDir

.PHONY: test
test:
	$(eval opt := --minify --renderToMemory --printPathWarnings --debug)
	export HUGO_VERSION=$(shell make get-hugo-version) && \
		$(DOCKER_COMPOSE) run --rm --entrypoint=npm hugo ci && \
		$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(opt)

.PHONY: npm-test
npm-test:
	cd ./exampleSite && \
		hugo --minify --renderToMemory --printPathWarnings --debug

.PHONY: metrics
metrics:
	$(eval opt := --minify \
		--renderToMemory --printPathWarnings --debug \
		--templateMetrics --templateMetricsHints)
	export HUGO_VERSION=$(shell make get-hugo-version) && \
		$(DOCKER_COMPOSE) run --rm --entrypoint=npm hugo ci && \
		$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(opt)

.PHONY: cibuild
cibuild:
	cd ./exampleSite && \
		npm ci && \
		hugo --minify --cleanDestinationDir \
			--environment "staging" \
			--printPathWarnings --debug \
			--templateMetrics --templateMetricsHints

.PHONY: cibuild-prod
cibuild-prod:
	cd ./exampleSite && \
		npm ci && \
		hugo --minify --cleanDestinationDir \
			--printPathWarnings && \
		wget -O ./public/report.html ${BASE_URL}/report.html || true

.PHONY: fetchdata
fetchdata:
	cd ./exampleSite && \
		bash ./scripts/fetch_data.sh ${GH_USER_ID} > ./data/github/${GH_USER_ID}.json && \
		deno run --allow-net --allow-read --allow-write --unstable scripts/fetch_images.ts

.PHONY: get-go-version
get-go-version:
	@cd ./deps && go mod edit -json | jq -r '.Go'

.PHONY: get-hugo-version
get-hugo-version:
	@cd ./deps && go mod edit -json | jq -r '.Require[] | select(.Path == "github.com/gohugoio/hugo") | .Version | split("v") | .[1]'
