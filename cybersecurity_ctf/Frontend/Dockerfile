FROM node:lts-alpine AS build

WORKDIR /app


ENV PATH /app/node_modules/.bin:$PATH

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && \
    pnpm install

COPY . ./

RUN pnpm run build

FROM httpd:2.4.49

RUN apt-get update && apt-get install -y postgresql-client
RUN apt-get install iputils-ping -y
RUN apt-get install net-tools -y
RUN apt-get install nano -y


COPY --from=build /app/build/ /usr/local/apache2/htdocs/
COPY .htaccess /usr/local/apache2/htdocs/
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
COPY connect_db.sh /usr/local/apache2/connect_db.sh
COPY robots.txt /usr/local/apache2/htdocs/robots.txt

RUN chmod +x /usr/local/apache2/connect_db.sh
CMD httpd-foreground -c "LoadModule modules/mod_cgid.so"



