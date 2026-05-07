install:
	npm ci

build:
	npm run build

start:
	npx start-server -s $(PWD)/frontend/dist

lint:
	npm run lint
