# Step 1: Use Node 20 to build the app
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Install dependencies properly
COPY package.json package-lock.json ./
RUN rm -rf node_modules package-lock.json && npm install

# Debug: Check if web-streams-polyfill is installed
RUN ls node_modules | grep web-streams-polyfill

# Copy the entire source code into the container
COPY . .

# Debugging step: List files in the /app directory (can be removed after confirming)
RUN echo "Listing all files in /app:" && ls -alh /app

# Build the web app (corrected command)
RUN npx expo export

# Step 2: Use Nginx to serve the static files
FROM nginx:alpine

# Copy the correct build directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for serving the app
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
