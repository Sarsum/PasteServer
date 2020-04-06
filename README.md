# PasteServer
PasteServer to upload text or code.
Demo: https://just-paste.it

# Usage
You can use this [Docker Image](https://hub.docker.com/r/einsarsum/pasteserver) out of the box with the file storage:
```yml
version: "3"

services
    pasteserver:
        image: einsarsum/pasteserver
        ports:
         - 5000:5000
```

Or with [Redis](https://hub.docker.com/_/redis) as database:
```yml
version: "3"

services:
  pasteserver:
    image: einsarsum/pasteserver
    ports:
     - 5000:5000
    depends_on:
     - database
    environment:
     - STORAGE_TYPE=redis
     - STORAGE_HOST=database
     - STORAGE_PASSWORD=password

  database:
    image: redis:alpine
    entrypoint: redis-server --appendonly yes --requirepass password
```
Or with [ArangoDB](https://hub.docker.com/_/arangodb) as database
```yml
version: "3"

services:
    pasteserver:
        image: einsarsum/pasteserver
        ports:
         - 5000:5000
        depends_on:
         - database
        environment:
         - STORAGE_TYPE=arango
         - STORAGE_HOST=database
         - STORAGE_PORT=8529
         - STORAGE_PASSWORD=password
         - STORAGE_DATABASE=pasteServer

    database:
        image: arangodb
        environment:
         - ARANGO_ROOT_PASSWORD=password
```

# Config
Docker environment variables

## Server-section
To configure the server itself

*  **PORT**: The port where the server will run on.

## Storage-section
To configure the document-storage

*  **STORAGE_TYPE**: The type of the storage. ("file", "redis" or "arangodb")
*  **STORAGE_HOST**: The Host of the storage-type.
*  **STORAGE_PORT**: The Port of the storage-type.
*  **STORAGE_PASSWORD**: The Password of the storage-type.

*  **STORAGE_USER**: The user to use for the authentication. (only ArangoDB)
*  **STORAGE_DATABASE**: The database to store the documents in. (only ArangoDB)

*  **DOCUMENT_EXPIRE**: The time in milliseconds after a document will be deleted when unused. (only Redis)

*  **STORAGE_PATH**: The path of the folder the document-files should be saved in. (only file-storage)

## RateLimit-section
To configure the rateLimits of creating and deleting documents

*  **CREATE_RATE_LIMIT_TIME_IN_MS**: The time in milliseconds in which a certain amount of requests are allowed per IP.
*  **CREATE_RATE_LIMIT_MAX_REQUESTS_PER_TIME**: The allowed amount of requests per IP per time.

## Document-section
To configure documents

*  **DOCUMENT_DATA_LIMIT**: The max. size the data of a creation-request is allowed to have.
*  **DOCUMENT_MAX_LENGTH**: The max. characters a document is allowed to have.

## KeyGenerator-section
To configure the creation of the document-keys

*  **KEY_GENERATOR_KEY_LENGTH**: The length of a key.
*  **KEY_GENERATOR_KEY_LENGTH**: The characters that will be used to create a key.
*  **KEY_GENERATOR_WITH_TO_UPPER_CASE**: When set to true, the keyChars will be duplicated and added to the current 
keyChars but with all letters in uppercase.


# API

You can use the API of the PasteServer to create, read and delete documents. All API requests can be made 
to the /documents-route (for example https://just-paste.it/documents).

## Create a document

Send a POST-request and as the body, the text the paste should have as plaintext.

If everything succeeded, you'll get the following response:

* **Status-Code**: 201 Created
* **Body**: A JSON containing the key ``key`` and ``deleteSecret`` for the key and secret of the document.

If the text is missing, the following:

* **Status-Code**: 400 Bad Request

If the text you want to save is too long, you'll get the following back:

* **Status-Code**: 413 Payload Too Large

If there was an error while saving the document, you'll get this:

* **Status-Code**: 500 Internal Server Error

The last three all contain this:

* **Body**: A JSON containing the key ```message``` for a short description of the issue while saving.

## Read a document

Send a GET-request to the /documents-route + the key of the wanted document
(for example https://just-paste.it/documents/$key).

If the document exists, you'll get the following response:

* **Status-Code**: 200 OK
* **Body**: A JSON containing the key ``text`` for the text of the document.

If not, this:

* **Status-Code**: 404 Not Found
* **Body**: A JSON containing the key ```message``` for a short description of the issue while getting.

## Delete a document

Send a GET-request to the /documents/delete-route + the key of the wanted document + the deleteSecret
(for example https://just-paste.it/documents/delete/$key/$deleteSecret). 

If everything succeeded, you'll get the following response:

* **Status-Code**: 200 OK

If the deleteSecret is missing, the following:

* **Status-Code**: 400 Bad Request

If the secret or the key is wrong, this:

* **Status-Code**: 403 Forbidden

Every response contains this:

 * **Body**: A JSON containing the key ```message``` for a short description of what happened.
 
## RateLimits

There are rateLimits on creating and deleting documents to prevent attacks that might cause a crash.
The amount of allowed requests per time per ip can be changed in the ``config.js``.
Once the rateLimit is reached, you'll get the following response:

* **Status-Code**: 429 Too Many Requests
* **Body**: A JSON containing the key ```message``` for a short description of what happened.
