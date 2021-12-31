FROM node:14
RUN mkdir /cert
COPY package*.json ./
RUN npm install
COPY ../server /server
COPY ../wiki /wiki
EXPOSE 3000
CMD ["npm", "start"]