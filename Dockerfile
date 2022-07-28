FROM node:16.13.0
ENV NODE_ENV production
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 5000
COPY . .
CMD ["npm", "start"]