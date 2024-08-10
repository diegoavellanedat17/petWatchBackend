# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 443

# Define the volume for the SQLite database file
VOLUME ["/app/database"]

# Start the application
CMD ["npm", "run", "start"]
