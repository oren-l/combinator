FROM node:20-alpine

WORKDIR /workspace

COPY examples/.npm-local .npm-local
RUN npm install -g .npm-local/combinator.tgz

# copy combinator-proxy config file
COPY e2e/simple-routing/combinator-proxy.json .
