FROM node:14

RUN mkdir /cert
RUN mkdir /test

COPY ./server/package*.json /server/
COPY ./wiki/package*.json /wiki/

RUN cd /server/ && ls && npm install && cd ..

COPY ./server /server/
COPY ./wiki /wiki/

EXPOSE 3000
WORKDIR /server
CMD ["npm","start"]