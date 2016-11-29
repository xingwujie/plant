# Collection Schema

## User

- _id (MongoId)
- facebook - facebook OAuth info
- google - google OAuth info
- name
- email
- createdAt
- updatedAt
- loc - to be moved to Location collection

## Location

- _id (MongoId)
- ownerIds (array of MongoIds that exist in the User collection)
- managerIds (array of MongoIds that exist in the User collection)
- title (name of the location)
- loc (received from User collection - this is the Geo location of the Location)
- public - a boolean flag which is `false` (missing) by default. Indicates if the geo location of these plants can be made public.
- password - an array of objects - allows user with the password access to the geo positions at this location.
  - (expire-)date - date integer (locale based)
  - (expire-)time - time integer (locale based)
  - password - (password hash)
- userId - MongoId of the user that created this document

## Plant

- _id (MongoId)
- title
- purchasedDate - actually acquired date
- plantedDate - an integer YYYYMMDD
- userId - MongoId of the user that created this document
- locationId - to be added soon when Location gets added

## Note

- _id (MongoId)
- date - an integer YYYYMMDD
- note - string 
- plantIds - (array of MongoIds that exist in the Plant collection)
- userId - MongoId of the user that created this document
- images - an array of objects
  - id - MongoId that corresponds to the name of the file in S3
  - ext - file extension e.g. jpg, png
  - originalname - original name of the file when it was uploaded
  - size - size in bytes of the original file
  - sizes - an array of objects
    - name - (string) name of the size, e.g. thumb, sm, md, lg, xl
    - width - (int32) pixels wide, e.g. 100, 500, 1000, 1500, 2000
- metrics - an object with key/value pairs. Values are numbers or boolean.
  - See the app/libs/utils.js file for possible keys in this object and the data types
