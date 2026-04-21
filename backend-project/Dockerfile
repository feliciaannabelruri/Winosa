# Gunakan Node.js versi 20
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all files
COPY . .

# Set port default Hugging Face
ENV PORT=7860
EXPOSE 7860

# Jalankan server
CMD ["node", "server.js"]