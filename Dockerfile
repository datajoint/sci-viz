FROM node:16-alpine3.15

RUN apk update
RUN apk add nginx
RUN apk add jq
RUN apk add yq

# Permissions needed to run nginx as a non root user
RUN chown -R node:node /usr/share/nginx
RUN chown -R node:node /var/lib/nginx
RUN chmod 777 /var/log/nginx
RUN chmod 777 /run/nginx    
RUN chown -R node:node /run/nginx 

USER node
WORKDIR /home/node
COPY --chown=node:node ./package.json /home/node
# COPY ./yarn.lock /home/node
ARG REACT_APP_DJSCIVIZ_BACKEND_PREFIX=/api
RUN yarn install


COPY --chown=node:node ./tsconfig.json /home/node
COPY --chown=node:node ./src /home/node/src
COPY --chown=node:node ./public /home/node/public
COPY --chown=node:node ./default.conf /etc/nginx/http.d/
COPY --chown=node:node ./default.conf /etc/nginx/conf.d/
COPY --chown=node:node ./sci-viz-hotreload-dev.sh .
COPY --chown=node:node ./sci-viz-hotreload-prod.sh .
ENV NODE_OPTIONS --max-old-space-size=6000
ARG PUBLIC_URL=./
RUN yarn build
RUN chmod -R 777 ./build
CMD ["nginx", "-g", "daemon off;"]