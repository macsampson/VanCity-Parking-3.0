FROM node:11.8.0-alpine as builder
RUN mkdir -p /usr/src/app/frontend

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm cache verify && npm install
# RUN npm i -g serve

# copy app source to image _after_ npm install so that
# application code changes don’t bust the docker cache of 
# npm install step
COPY . /usr/src/app

# set application PORT and expose docker PORT, 80 is what Elastic Beanstalk expects
# EXPOSE 3000

RUN npm run build

# CMD ["serve", "-s", "build"]
# CMD ["npm", "start"]

# Start and nginx container
FROM nginx

# Set our custom nginx.conf in the container
RUN rm /etc/nginx/conf.d/default.conf
COPY ./data/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the react build from the build container
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Set permissions so nginx can serve it
RUN chown nginx.nginx /usr/share/nginx/html/ -R

EXPOSE 80