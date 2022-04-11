FROM artifacts.bcp.absa.co.za/architecture-and-engineering-docker-local/node-16.13.2-slim as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN ~/configs/*.env /usr/src/app

RUN npm install

COPY . . 

RUN npm i -g rimraf

RUN npm run build

FROM artifacts.bcp.absa.co.za/architecture-and-engineering-docker-local/node-16.13.2-slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/certs ./dist/certs

RUN NODE_OPTIONS="--max-http-headers-size=81000"

EXPOSE 80 443
CMD ["node", "dist/main"]
