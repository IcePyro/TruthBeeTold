FROM node:14
RUN mkdir /cert
COPY ./server/package*.json ./server/package*.json
COPY ./wiki/package*.json ./wiki/package*.json
CMD ["npm", "--prefix", "./server", "install", "./server"]

COPY ./server/ ./server/
COPY ./wiki/ ./wiki/
EXPOSE 3000
CMD ["npm", "--prefix", "./server","start"]