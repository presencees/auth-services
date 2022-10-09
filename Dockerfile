FROM node:16.15-alpine3.14
ENV TZ="Asia/Makassar"
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser -S app
COPY . .
RUN npm install npm@8.19.2 --location=global
RUN npm install
# RUN npm install pm2 -g
RUN npm install nodemon --location=global
RUN chown -R app /opt/app
USER app
EXPOSE ${EXP_PORT}
# CMD [ "nodemon", "index.js"]
# CMD ["pm2-runtime", "index.js"]
