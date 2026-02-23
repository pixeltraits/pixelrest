FROM node:22-alpine
WORKDIR /docs
COPY package.json package-lock.json* ./
RUN npm install
EXPOSE 5173
CMD ["npx", "vitepress", "dev", "--host", "0.0.0.0"]
