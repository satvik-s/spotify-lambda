deploy:
	rm -rf dist
	rm -rf cdk.out
	npm run build
	cdk bootstrap
	cdk synth
	cdk deploy
