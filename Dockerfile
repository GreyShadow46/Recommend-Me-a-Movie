# Use Node.js 22 Alpine (lightweight)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

EXPOSE 8080

# Start the application
CMD ["node", "app.js"]