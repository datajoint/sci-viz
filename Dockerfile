FROM node:16-alpine3.14

WORKDIR /main
COPY ./package.json /main
RUN npm install

RUN apk update
RUN apk add nginx

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN pip3 install pyyaml

COPY ./tsconfig.json /main
COPY ./frontend_gen.py .
COPY ./src /main/src
COPY ./public /main/public
COPY ./default.conf /etc/nginx/http.d/
COPY ./default.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]