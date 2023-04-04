FROM node:18-alpine as base
WORKDIR /src
COPY package*.json ./

FROM base as production
RUN npm ci
COPY --chown=node:node . ./
USER node
CMD ["npm", "start"]