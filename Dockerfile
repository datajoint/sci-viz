FROM node:16-alpine3.15

RUN apk update
RUN apk add nginx
RUN apk add jq
RUN apk add yq

WORKDIR /main
COPY ./package.json /main
RUN yarn install
COPY ./tsconfig.json /main
COPY ./src /main/src
COPY ./public /main/public
RUN yarn build
RUN ls -la
RUN	mkdir --parents /usr/share/nginx/html/build
RUN mv ./build /usr/share/nginx/html/build
RUN rm -r /main/src

COPY ./default.conf /etc/nginx/http.d/
COPY ./default.conf /etc/nginx/conf.d/
COPY ./sci-viz-hotreload-prod.sh .

CMD ["nginx", "-g", "daemon off;"]