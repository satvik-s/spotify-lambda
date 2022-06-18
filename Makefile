deploy:
	rm -rf dist*
	rm -rf cdk.out
	npm run build-now-playing
	npm run build-top-tracks
	cdk synth
	cdk deploy
