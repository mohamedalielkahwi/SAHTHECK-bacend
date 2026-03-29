FROM node:20-alpine

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy all source files
COPY . .

# generate prisma client
RUN npx prisma generate

# build the app
RUN npm run build

# verify dist exists
RUN ls -la /app/dist/

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]