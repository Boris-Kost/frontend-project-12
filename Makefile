install:
	npm ci

build: install
	npm run build

start:
	npx start-server

lint:
	npm run lint
