install:
	npm ci

build:
	npm run build

start:
	npx start-server -p $$PORT -s $$PWD/frontend/dist

lint:
	npm run lint
