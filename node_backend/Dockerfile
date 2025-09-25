FROM node

WORKDIR /usr/src/mockable
COPY package*.json ./
COPY . .
RUN npm i 
RUN npm run build
EXPOSE 3000


CMD ["npm", "run", "dev"]
