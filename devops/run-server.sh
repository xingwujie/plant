# This script can be used to start the server

# If you have Docker installed then this will setup CouchDB for you.
# If you don't have Docker and already have CouchDB installed then comment out these lines
# If the container is already running then this will print a message that can be ignored.
docker pull klaemo/couchdb:latest
docker run -d -p 5984:5984 --name couchdb klaemo/couchdb
docker start couchdb
docker ps

# Look at readme to setup your own Facebook (FB) credentials
export PLANT_FB_ID=facebook-app-id
export PLANT_FB_SECRET=facebook-app-secret

# For testing and dev work you can leave this as it is.
# If you use this script to run a prod server then you need to change this
export PLANT_TOKEN_SECRET=json-web-token-secret

# These generally don't need to be changed for dev work
export PLANT_DB_URL=http://localhost:5984
export PLANT_DB_NAME=plant-development

# Set to relevant environment
export NODE_ENV=development

# You can comment out the DEBUG line below if you want fewer terminal messages
export DEBUG=plant:*

nodemon server.js
