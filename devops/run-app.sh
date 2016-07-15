
# Run CouchDB locally for performance.
# Comment this out and open and new terminal window to switch to Cloudant
docker pull klaemo/couchdb:latest
docker run -d -p 5984:5984 --name couchdb klaemo/couchdb
docker start couchdb
docker ps

export PLANT_DB_URL=http://localhost:5984
export PLANT_DB_NAME=plant-development
export DEBUG=plant:*

nodemon server.js