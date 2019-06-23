FROM node:11.8.0-alpine as builder
# RUN mkdir -p /usr/src/app

# Create app directory
# WORKDIR /usr/src/app
RUN mkdir -p /app/server
WORKDIR /app/server

# install dependencies
COPY package*.json ./
RUN npm cache verify && npm install

# copy app source to image _after_ npm install so that
# application code changes don’t bust the docker cache of 
# npm install step
COPY . /app/server/

# set application PORT and expose docker PORT, 80 is what Elastic Beanstalk expects
# EXPOSE 3001

FROM node:11.8.0-alpine

# Create and set the working directory
RUN mkdir -p /app/server
WORKDIR /app/server

# Copy the server from the build container
COPY --from=builder /app/server /app/server

CMD [ "npm", "start" ]
