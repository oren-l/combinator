FROM node:20-alpine

WORKDIR /workspace

COPY examples/.npm-local .npm-local
RUN npm install -g .npm-local/combinator.tgz

EXPOSE 8080
