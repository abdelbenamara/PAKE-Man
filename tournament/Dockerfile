FROM node:22

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Build frontend
RUN npm run build

# Serve using Fastify
CMD ["npm", "run", "serve"]

EXPOSE 5174
