FROM node:22

WORKDIR /app

COPY package.json package-lock.json* ./

ENV HUSKY=0

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host=0.0.0.0"]
