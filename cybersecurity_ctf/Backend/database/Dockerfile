FROM postgres:15.2-alpine

LABEL author="Mathis Dory"
LABEL description="Postgres Image"
LABEL version="1.0"

COPY *.sql /docker-entrypoint-initdb.d/
