FROM node:16

WORKDIR /gif-player

COPY . .

EXPOSE 3000

CMD ["node", "./backend/app.js"]