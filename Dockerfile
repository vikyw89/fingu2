FROM node:20.2.0-alpine3.18
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
EXPOSE 3000
CMD npm run start