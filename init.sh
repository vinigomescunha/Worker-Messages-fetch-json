#!/bin/sh
port=9200
host="http://localhost"
httpserver=node_modules/http-server/bin/http-server
if [[ ! -f "$httpserver" ]]; then
	npm install --save http-server
fi;
google-chrome "${host}:${port}" | $httpserver -p $port

