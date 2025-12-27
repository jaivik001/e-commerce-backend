# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

RUN npx secure-env src/config/env/development.env -s ECfgfdh9l36m67lf50HFGT2fy8b6a44

# Expose the port on which the app will run
EXPOSE 3000
# Command to run the application
CMD ["npm", "run", "start"]

