pwd := $(CURDIR)
cmd := ""
DOCKER_COMPOSE := docker-compose
OPEN_BROWSER := open http://localhost:1313
BASE_URL := https://hugothemeiris.peaceiris.app/


.PHONY: up
up:
	# $(OPEN_BROWSER)
	$(DOCKER_COMPOSE) up

.PHONY: hugo
hugo:
	$(DOCKER_COMPOSE) run --rm hugo $(cmd)

.PHONY: data
data:
	curl 'https://api.github.com/users/peaceiris/repos?per_page=100&page=1' > ./exampleSite/data/github/peaceiris.json
	# curl 'https://api.github.com/users/hugojapan/repos?per_page=100&page=1' > ./exampleSite/data/github/hugojapan.json

.PHONY: build
build:
	$(eval opt := --gc --minify --themesDir ../ --layoutDir ../layouts --baseURL $(BASE_URL))
	$(DOCKER_COMPOSE) run --rm hugo $(opt)

.PHONY: test
test:
	$(eval opt := --gc --minify --themesDir ../ --layoutDir ../layouts --baseURL $(BASE_URL) --renderToMemory)
	$(DOCKER_COMPOSE) run --rm hugo $(opt)

.PHONY: buildgha
buildgha:
	cd ./exampleSite && \
		hugo --gc --minify --themesDir ../ --layoutDir ../layouts --baseURL $(BASE_URL)
