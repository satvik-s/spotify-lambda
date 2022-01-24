deploy:
	rm -rf dist
	rm -rf cdk.out
	npm run build
	npm run synth
	npm run deploy
