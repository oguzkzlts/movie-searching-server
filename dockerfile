# Use official Node.js image as base
FROM node:alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project directory to the container
COPY . .

# Expose port 3000 to access the React app
EXPOSE 3000

# Command to run the React app
CMD ["npm", "start"]
