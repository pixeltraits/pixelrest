FROM node:15.10.0

COPY . /var/www/
WORKDIR /var/www

RUN npm install

EXPOSE 1338



