FROM node:16

WORKDIR /gif-player

RUN npm i -g nodemon

COPY . .

ENV PORT=3000

EXPOSE 3000

VOLUME [ "/media" ]

CMD ["bash", "./bknd.sh"]