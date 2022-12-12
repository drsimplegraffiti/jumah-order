FROM node
RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4545
CMD [ "npm", "start" ]

