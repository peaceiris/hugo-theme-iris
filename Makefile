pwd := $(CURDIR)
cmd := ""
DOCKER_COMPOSE := docker compose
GH_USER_ID := peaceiris


.PHONY: bump-node
bump-node:
	bash scripts/bump_node.sh

.PHONY: docker-dev
docker-dev: npm-ci
	$(eval opt := server --navigateToChanged --bind=0.0.0.0 --buildDrafts)
	export HUGO_VERSION=v$(shell make get-hugo-version) && \
	$(DOCKER_COMPOSE) up -d && \
	$(DOCKER_COMPOSE) exec hugo hugo $(opt)

.PHONY: docker-hugo
docker-hugo: npm-ci
	# make docker-hugo cmd="version"
	export HUGO_VERSION=v$(shell make get-hugo-version) && \
	$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(cmd)

.PHONY: docker-build
docker-build: npm-ci
	$(eval opt := --minify --cleanDestinationDir)
	export HUGO_VERSION=v$(shell make get-hugo-version) && \
	$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(opt)

.PHONY: docker-test
docker-test: npm-ci
	$(eval opt := --minify --renderToMemory --printPathWarnings --debug \
		--templateMetrics --templateMetricsHints)
	export HUGO_VERSION=v$(shell make get-hugo-version) && \
	$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(opt)

.PHONY: npm-ci
npm-ci:
	cd ./exampleSite && \
	npm ci

.PHONY: dev
dev:
	cd ./exampleSite && \
	hugo server --renderStaticToDisk --navigateToChanged --buildDrafts

.PHONY: test
test:
	cd ./exampleSite && \
	hugo --minify --renderToMemory --printPathWarnings --debug \
		--templateMetrics --templateMetricsHints

.PHONY: build-staging
build-staging:
	cd ./exampleSite && \
	hugo --minify --cleanDestinationDir \
		--environment "staging" \
		--printPathWarnings --debug \
		--templateMetrics --templateMetricsHints

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
	@cd ./deps && go mod edit -json | jq -r '.Go'

.PHONY: get-hugo-version
get-hugo-version:
	@cd ./deps && go mod edit -json | jq -r '.Require[] | select(.Path == "github.com/gohugoio/hugo") | .Version | split("v") | .[1]'
