# Use a Node.js base image (LTS version)
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install -g expo-cli
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port for Expo's development server
EXPOSE 19000

# Start Expo in the container
CMD ["expo", "start", "--tunnel"]
