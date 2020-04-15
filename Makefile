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

.PHONY: bumphugo
bumphugo:
	export TARGET_FILES=".env netlify.toml theme.toml"
	export HUGO_VERSION_LATEST=$(curl -s "https://api.github.com/repos/gohugoio/hugo/releases/latest" | jq -r '.tag_name')
	export HUGO_VERSION_CURRENT=$(. ./.env && echo ${HUGO_VERSION})
	sed -i "s/${HUGO_VERSION_CURRENT}/${HUGO_VERSION_LATEST}/g" ${TARGET_FILES}
	git add ${TARGET_FILES}
	git commit -m "deps: bump hugo from ${HUGO_VERSION_CURRENT} to ${HUGO_VERSION_LATEST}"

.PHONY: build
build:
	$(eval opt := --gc --minify --themesDir ../../ --baseURL $(BASE_URL))
	$(DOCKER_COMPOSE) run --rm hugo $(opt)

.PHONY: test
test:
	$(eval opt := --gc --minify --themesDir ../../ --baseURL $(BASE_URL) --renderToMemory)
	$(DOCKER_COMPOSE) run --rm hugo $(opt)

.PHONY: buildgha
buildgha:
	cd ./exampleSite && \
		hugo --gc --minify --themesDir ../../ --baseURL $(BASE_URL)
