FROM node:11.8.0-alpine
RUN mkdir -p /usr/src/app/frontend

# Create app directory
WORKDIR /usr/src/app/frontend

# install dependencies
COPY package*.json ./
RUN npm cache verify && npm install
RUN npm i -g serve

# copy app source to image _after_ npm install so that
# application code changes don’t bust the docker cache of 
# npm install step
COPY . .

# set application PORT and expose docker PORT, 80 is what Elastic Beanstalk expects
EXPOSE 5000

RUN npm run build

CMD ["serve", "-s", "build"]
