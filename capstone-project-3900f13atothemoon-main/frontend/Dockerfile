# Use an official Node.js runtime as a parent image
FROM node

# Set the working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container at /app/frontend
COPY . .

# Expose port 3000 for the React app
EXPOSE 3000

# Define the command to run the React application
CMD ["npm", "start"]