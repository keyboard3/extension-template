.PHONY: zipstore
zipstore: chromezip firefoxzip

chromezip:
	@(cd ./dist/chrome && zip -r -q -9 ../chrome.zip . -x '*.DS_Store')

firefoxzip:
	@(cd ./dist/firefox && zip -r -q -9 ../firefox.zip . -x '*.DS_Store')
