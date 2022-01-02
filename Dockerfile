FROM node:14
RUN mkdir /cert
COPY ./server/package*.json /server/
COPY ./wiki/package*.json /wiki/
WORKDIR /server/
CMD ["npm", "install"]
COPY ./server/ /server/
COPY ./wiki/ /wiki/
EXPOSE 3000
CMD ["npm", "--prefix", "./server","start"]