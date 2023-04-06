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
COPY ./package.json /home/node
# COPY ./yarn.lock /home/node
ARG REACT_APP_DJSCIVIZ_BACKEND_PREFIX=/api
RUN yarn install


COPY ./tsconfig.json /home/node
COPY ./src /home/node/src
COPY ./public /home/node/public
COPY ./default.conf /etc/nginx/http.d/
COPY ./default.conf /etc/nginx/conf.d/
COPY ./sci-viz-hotreload-dev.sh .
COPY ./sci-viz-hotreload-prod.sh .
ENV NODE_OPTIONS --max-old-space-size=6000
RUN yarn build
RUN chmod -R 777 ./build
CMD ["nginx", "-g", "daemon off;"]