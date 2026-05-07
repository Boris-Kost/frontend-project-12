install:
	npm ci

build: install
	npm run build

start:
	npx start-server -s frontend/dist

lint:
	npm run lint
