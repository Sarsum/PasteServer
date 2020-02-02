FROM node:13-alpine3.10

#Set default values of env variables
ENV PORT=5000

ENV STORAGE_TYPE="file"
ENV STORAGE_HOST="127.0.0.1"
ENV STORAGE_PORT=6379
ENV STORAGE_PASSWORD="password"
ENV STORAGE_USER="root"
ENV STORAGE_DATABASE="pasteServer"
#Value of 3 * 24 * 60 * 60 * 1000
ENV DOCUMENT_EXPIRE=259200000
ENV STORAGE_PATH="data"

ENV CREATE_RATE_LIMIT_TIME_IN_MS=60000
ENV CREATE_RATE_LIMIT_MAX_REQUESTS_PER_TIME=15

ENV DOCUMENT_DATA_LIMIT="2mb"
ENV DOCUMENT_MAX_LENGTH=400000

ENV KEY_GENERATOR_KEY_LENGTH=10
ENV KEY_GENERATOR_KEY_CHARS="abcdefghijklmnopqrstivwxyz0123456789"
ENV KEY_GENERATOR_WITH_TO_UPPER_CASE=true

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ENTRYPOINT ["npm", "start"]
