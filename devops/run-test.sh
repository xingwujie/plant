# This script can be used to start the server

# If you have Docker installed then this will setup CouchDB for you.
# If you don't have Docker and already have CouchDB installed then comment out these lines
# If the container is already running then this will print a message that can be ignored.
docker pull klaemo/couchdb:latest
docker run -d -p 5984:5984 --name couchdb klaemo/couchdb
docker start couchdb
docker ps

# Set to relevant environment
export NODE_ENV=development

# You can comment out the DEBUG line below if you want fewer terminal messages
export DEBUG=plant:*

node_modules/mocha/bin/_mocha test/**/*.js --recursive --require babel-core/register --require test/setup.js
