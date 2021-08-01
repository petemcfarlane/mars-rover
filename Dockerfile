FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY src ./src
COPY data ./data
COPY tsconfig.json ./
RUN npx tsc
ENTRYPOINT [ "node", "dist/index.js" ]
