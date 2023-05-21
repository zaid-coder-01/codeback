FROM node:16.19.1

WORKDIR /server
COPY . .
RUN npm install
WORKDIR /server/src
EXPOSE 3001
CMD node App.js