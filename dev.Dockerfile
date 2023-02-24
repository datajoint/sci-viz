FROM node:16-alpine3.15

WORKDIR /main
COPY ./package.json /main
# COPY ./yarn.lock /main
RUN yarn install

RUN apk update
RUN apk add nginx
RUN apk add jq
RUN apk add yq

COPY ./tsconfig.json /main
COPY ./frontend_gen.py .
COPY ./src /main/src
COPY ./public /main/public
COPY ./default.conf /etc/nginx/http.d/
COPY ./default.conf /etc/nginx/conf.d/
COPY ./sci-viz-hotreload-dev.sh .
COPY ./sci-viz-hotreload-prod.sh .

CMD ["nginx", "-g", "daemon off;"]