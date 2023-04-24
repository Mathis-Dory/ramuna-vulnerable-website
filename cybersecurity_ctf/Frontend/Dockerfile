FROM node:lts-alpine AS build

WORKDIR /app


ENV PATH /app/node_modules/.bin:$PATH

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && \
    pnpm install

COPY . ./

RUN pnpm run build

FROM httpd:2.4.49-alpine

RUN apk update && apk add curl

COPY --from=build /app/build/ /usr/local/apache2/htdocs/
COPY .htaccess /usr/local/apache2/htdocs/
COPY httpd.conf /usr/local/apache2/conf/httpd.conf



