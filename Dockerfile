FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# Vite butuh flag --host agar bisa diakses dari luar container
CMD ["npm", "run", "dev", "--", "--host"]