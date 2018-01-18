FROM node:8.9.3-alpine

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Bundle app source
COPY . .