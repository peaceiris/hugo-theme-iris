pwd := $(CURDIR)
cmd := ""
DOCKER_COMPOSE := docker-compose
OPEN_BROWSER := open http://localhost:1313
BASE_URL := https://hugothemeiris.peaceiris.app/


.PHONY: up
up:
	# $(OPEN_BROWSER)
	$(DOCKER_COMPOSE) up -d
	$(DOCKER_COMPOSE) exec hugo hugo \
		server --navigateToChanged --bind=0.0.0.0 --buildDrafts --themesDir ../../ --i18n-warnings

.PHONY: npm-up
npm-up:
	cd ./exampleSite && \
	hugo server --navigateToChanged --buildDrafts --themesDir ../../ --i18n-warnings

.PHONY: hugo
hugo:
	# make hugo cmd="version"
	$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(cmd)

.PHONY: bumphugo
bumphugo:
	bash ./scripts/bump_hugo.sh

.PHONY: build
build:
	$(eval opt := --minify --themesDir ../../ --baseURL $(BASE_URL) --cleanDestinationDir)
	$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(opt)

.PHONY: npm-build
npm-build:
	cd ./exampleSite && \
	hugo --minify --themesDir ../../ --baseURL $(BASE_URL) --cleanDestinationDir

.PHONY: test
test:
	$(eval opt := --minify --themesDir ../../ --baseURL $(BASE_URL) \
		--renderToMemory --i18n-warnings --path-warnings --debug)
	$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(opt)

.PHONY: npm-test
npm-test:
	cd ./exampleSite && \
	hugo --minify --themesDir ../../ --baseURL $(BASE_URL) \
		--renderToMemory --i18n-warnings --path-warnings --debug

.PHONY: metrics
metrics:
	$(eval opt := --minify --themesDir ../../ --baseURL $(BASE_URL) \
		--renderToMemory --i18n-warnings --path-warnings --debug \
		--templateMetrics --templateMetricsHints)
	$(DOCKER_COMPOSE) run --rm --entrypoint=hugo hugo $(opt)

.PHONY: cibuild
cibuild:
	cd ./exampleSite && \
		hugo --minify \
			--themesDir ../../ \
			--baseURL '/' \
			--cleanDestinationDir \
			--i18n-warnings --path-warnings --debug \
			--templateMetrics --templateMetricsHints
